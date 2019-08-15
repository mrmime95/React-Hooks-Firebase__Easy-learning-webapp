import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';

export const FriendsContext = React.createContext();

const defaultFilters = {
    order: ['name', 'asc'],
    searchTerm: '',
    minCards: 0,
    minPacks: 0,
    minSubjects: 0,
    roles: [],
    tags: [],
};

export default function FriendsProvider(props: { users: [Users] }) {
    const [state, setState] = useState({
        friends: [],
        isLoading: false,
    });
    const [filters, setFilters] = useState(defaultFilters);
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        getAllFriends();
    }, []);
    useEffect(() => {
        getAllFriends();
    }, [filters]);

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
                        tags: friendData.data().tags,
                    };
                })
            );
            const showFriends = (requesterUsers || [])
                .filter(filterByUserNameFn(filters.searchTerm))
                .filter(filterByMinCardsFn(filters.minCards))
                .filter(filterByMinPacksFn(filters.minPacks))
                .filter(filterByMinSubjectsFn(filters.minSubjects))
                .filter(filterByRoles(filters.roles))
                .filter(filterByTags(filters.tags))
                .sort(sortFn(filters.order[0], filters.order[1]));
            setState({ ...state, friends: showFriends });
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

    async function onSearch(data: SearchData) {
        setState({ ...state, friends: [] });

        const ordBy = getOrder(data.sort.value);
        const roles = [];
        if (data.users) {
            roles.push('user');
        }
        if (data.approvers) {
            roles.push('approver');
        }
        if (data.admins) {
            roles.push('admin');
        }
        setFilters({
            order: ordBy,
            searchTerm: data.searchTerm || '',
            minCards: data.minCards || 0,
            minPacks: data.minPacks || 0,
            minSubjects: data.minSubjects || 0,
            roles,
            tags: data.tags.map(tag => tag.text) || [],
        });
    }

    function getOrder(sort: string): [string, string] {
        const sortArray = sort.split('_');
        let sortBy;
        switch (sortArray[0]) {
            case 'name':
                sortBy = 'name';
                break;
            case 'status':
                sortBy = 'role';
                break;
            case 'words-number':
                sortBy = 'cards';
                break;
            case 'packages-name':
                sortBy = 'packages';
                break;
            case 'subjects-number':
                sortBy = 'subjects';
                break;
            default:
                sortBy = 'name';
                break;
        }

        return [sortBy, sortArray[1] === 'asc'];
    }
}

function filterByUserNameFn(name: string) {
    return user => {
        return user.name.toUpperCase().indexOf(name.toUpperCase()) >= 0;
    };
}

function filterByMinCardsFn(minCardsNumber: number) {
    return user => {
        return user.cards >= minCardsNumber;
    };
}

function filterByRoles(roles: string[]) {
    return user => {
        return roles.includes(user.role);
    };
}

function filterByTags(tags: string[]) {
    return user => {
        return tags.every(tag => user.tags.includes(tag));
    };
}
function filterByMinPacksFn(minPacksNumber: number) {
    return user => {
        return user.packages >= minPacksNumber;
    };
}
function filterByMinSubjectsFn(minSubjectsNumber: number) {
    return user => {
        return user.subjects >= minSubjectsNumber;
    };
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
