import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';

export const FriendsContext = React.createContext();

const defaultPageSize = 10;
const defaultSortBy = 'name';
const defaultAscending = true;

type Users = {
    name: string,
    role: string,
    status: string,
    created: string,
    changed: string,
    lastActivity: string,
    id: number,
};

export default function FriendsProvider(props: { users: [Users] }) {
    const [state, setState] = useState({
        pageSize: defaultPageSize,
        pageOfUsers: getAPageOfContent(1, defaultPageSize, props.users.sort(sortFn(defaultSortBy, defaultAscending))),
        activePage: 1,
        filteredUsers: props.users.sort(sortFn(defaultSortBy, defaultAscending)),
        numberOfFilteredUsers: props.users.length,
        sort: defaultSortBy,
        sortAscending: defaultAscending,
        friends: [],
    });
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        getAllFriends();
    }, []);

    return (
        <FriendsContext.Provider
            value={{
                ...state,
                onSearch,
                onPagingChange,
                deleteFriendReques,
                acceptFriend,
                getAllFriends,
                deleteFriend,
            }}
        >
            {props.children}
        </FriendsContext.Provider>
    );

    async function acceptFriend(friendId: string) {
        const currentUserRef = fireContext.db.doc(`users/${fireContext.user.id}`);
        const friendUserRef = fireContext.db.doc(`users/${friendId}`);

        deleteFriendReques(friendId);
        const batch = fireContext.db.batch();

        const currentUser = await currentUserRef.get();
        const currentUsersFriendsArray = currentUser.data().friends || [];
        currentUsersFriendsArray.push(friendId);
        batch.update(currentUserRef, {
            friendCounter: fireContext.increment,
            friends: currentUsersFriendsArray,
        });

        const friendUser = await friendUserRef.get();
        const friendUsersFriendsArray = friendUser.data().friends || [];
        friendUsersFriendsArray.push(fireContext.user.id);
        batch.update(friendUserRef, {
            friendCounter: fireContext.increment,
            friends: friendUsersFriendsArray,
        });

        batch.commit();

        getAllFriends();
    }
    async function deleteFriendReques(requesterId: string) {
        const friendRequestNumberRef = fireContext.db.doc(`friendRequestNumber/${fireContext.user.id}`);
        const friendRequestNumber = await friendRequestNumberRef.get();
        if (friendRequestNumber.data().requesters.find(element => element === requesterId)) {
            const requesterArray = friendRequestNumber.data().requesters.filter(element => element !== requesterId);
            friendRequestNumberRef.update({ counter: fireContext.decrement, requesters: requesterArray });
        }
    }

    async function getAllFriends() {
        const userData = await fireContext.db
            .collection('users')
            .doc(fireContext.user.id)
            .get();
        const friends = userData.data().friends;
        if (friends) {
            const requesterUsers = await Promise.all(
                friends.map(async (friendId, index) => {
                    const friendData = await fireContext.db
                        .collection('users')
                        .doc(friendId)
                        .get();
                    return {
                        id: friendData.id,
                        email: friendData.data().email,
                        name: `${friendData.data().firstName} ${friendData.data().lastName}`,
                        birthDate: friendData.data().birthDate,
                        subjects: friendData.data().subjectsNumber,
                        packages: friendData.data().packagesNumber,
                        cards: friendData.data().cardsNumber,
                        role: friendData.data().role,
                        profilePicture: friendData.data().profilePicture,
                    };
                })
            );
            setState({ ...state, friends: requesterUsers });
        } else {
            setState({ ...state, friends: [] });
        }
    }

    async function deleteFriend(friendId: string) {
        const userRef = fireContext.db.doc(`users/${fireContext.user.id}`);
        const user = await userRef.get();
        if (user.data().friends.find(element => element === friendId)) {
            const friendArray = user.data().friends.filter(element => element !== friendId);
            userRef.update({ friendCounter: fireContext.decrement, friends: friendArray });
        }

        const friendRef = fireContext.db.doc(`users/${friendId}`);
        const friend = await friendRef.get();
        if (friend.data().friends.find(element => element === fireContext.user.id)) {
            const friendWithUserArray = friend.data().friends.filter(element => element !== fireContext.user.id);
            friendRef.update({ friendCounter: fireContext.decrement, friends: friendWithUserArray });
        }
        getAllFriends();
    }

    function onPagingChange(newState: { activePage: number, pageSize: number }) {
        setState({
            ...state,
            activePage: newState.activePage,
            pageSize: newState.pageSize,
            pageOfUsers: getAPageOfContent(newState.activePage, newState.pageSize, state.filteredUsers),
        });
    }

    function onSearch(data: SearchData) {
        let filtered = props.users
            .filter(filterByNameFn(data.searchTerm))
            .filter(filterByRolesFn(data.roles))
            .filter(filterByStatusesFn(data.statuses))
            .sort(sortFn(data.sort, data.sortAscending));

        setState({
            ...state,
            filteredUsers: filtered,
            pageOfUsers: getAPageOfContent(1, state.pageSize, filtered),
            numberOfFilteredUsers: filtered.length,
            activePage: 1,
            sort: data.sort,
            sortAscending: data.sortAscending,
        });
    }
}

function filterByNameFn(name: string) {
    return row => row.name.toUpperCase().indexOf(name.toUpperCase()) >= 0;
}
function filterByRolesFn(roles: [string]) {
    if (roles === null) return user => user;
    return user => roles.findIndex(role => role.toUpperCase() === user.role.toUpperCase()) >= 0;
}
function filterByStatusesFn(statuses: [string]) {
    if (statuses === null) return user => user;
    return user => statuses.findIndex(status => status.toUpperCase() === user.status.toUpperCase()) >= 0;
}

function sortFn(by: string, ascending: boolean) {
    return (firstElement: any, secondElement: any) =>
        ascending
            ? firstElement[by].toString().localeCompare(secondElement[by].toString())
            : secondElement[by].toString().localeCompare(firstElement[by].toString());
}

function getAPageOfContent(activePage: number, pageSize: number, content: any) {
    return content.slice((activePage - 1) * pageSize, Math.min(activePage * pageSize, content.length));
}
