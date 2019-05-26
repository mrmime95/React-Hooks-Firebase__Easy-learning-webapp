import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';

export const UsersContext = React.createContext();

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

export default function UsersProvider(props: { users: [Users] }) {
    const [state, setState] = useState({
        pageSize: defaultPageSize,
        pageOfUsers: getAPageOfContent(1, defaultPageSize, props.users.sort(sortFn(defaultSortBy, defaultAscending))),
        activePage: 1,
        filteredUsers: props.users.sort(sortFn(defaultSortBy, defaultAscending)),
        numberOfFilteredUsers: props.users.length,
        sort: defaultSortBy,
        sortAscending: defaultAscending,
        users: [],
    });
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <UsersContext.Provider value={{ ...state, onSearch, onPagingChange, createFriendReques, deleteFriendReques }}>
            {props.children}
        </UsersContext.Provider>
    );

    async function getAllUsers() {
        const allUsers = await fireContext.db.collection('users').get();
        const returnableUsers = await Promise.all(
            allUsers.docs.map(async doc => {
                const friendRequest = await fireContext.db
                    .collection('friendRequests')
                    .doc(fireContext.user.id + '_' + doc.id)
                    .get();
                return {
                    id: doc.id,
                    email: doc.data().email,
                    name: `${doc.data().firstName} ${doc.data().lastName}`,
                    birthDate: doc.data().birthDate,
                    subjects: doc.data().subjectsNumber,
                    packages: doc.data().packagesNumber,
                    cards: doc.data().cardsNumber,
                    role: doc.data().role,
                    requested: friendRequest.exists,
                };
            })
        );
        setState({ ...state, users: returnableUsers });
    }

    async function createFriendReques(requestedId: string) {
        const friendRequestsRef = fireContext.db
            .collection('friendRequests')
            .doc(fireContext.user.id + '_' + requestedId);
        const friendRequestNumberRef = fireContext.db.doc(`friendRequestNumber/${requestedId}`);
        const batch = fireContext.db.batch();
        const today = new Date();
        const dateTime =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate() +
            ' ' +
            today.getHours() +
            ':' +
            today.getMinutes() +
            ':' +
            today.getSeconds();
        batch.set(friendRequestsRef, {
            dateTime,
        });
        batch.update(friendRequestNumberRef, {
            counter: fireContext.increment,
        });
        batch.commit();
        getAllUsers();
    }

    async function deleteFriendReques(requestedId: string) {
        await fireContext.db
            .collection('friendRequests')
            .doc(fireContext.user.id + '_' + requestedId)
            .delete()
            .then(() => {
                console.log('Document successfully deleted!');
                getAllUsers();
                const friendRequestNumberRef = fireContext.db.doc(`friendRequestNumber/${requestedId}`);
                friendRequestNumberRef.update({ counter: fireContext.decrement });
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }

    async function getCurrentUsersFriends() {
        const usersFriends = await fireContext.db
            .doc(`users/${fireContext.user.id}`)
            .where('userId', '==', this.state.user.id)
            .get();
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
