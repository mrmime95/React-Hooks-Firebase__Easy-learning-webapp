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
const defaultFilters = {
    order: ['name', 'asc'],
    searchTerm: '',
    minCards: 0,
    minPacks: 0,
    minSubjects: 0,
    roles: [],
    tags: [],
};

export default function UsersProvider(props) {
    const [state, setState] = useState({
        /*  pageSize: defaultPageSize,
        pageOfUsers: getAPageOfContent(1, defaultPageSize, props.users.sort(sortFn(defaultSortBy, defaultAscending))),
        activePage: 1,
        filteredUsers: props.users.sort(sortFn(defaultSortBy, defaultAscending)),
        numberOfFilteredUsers: props.users.length,
        sort: defaultSortBy,
        sortAscending: defaultAscending, */
        users: [],
        isLoading: false,
    });
    const [filters, setFilters] = useState(defaultFilters);
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        fireContext.refreshFriends();
    }, []);

    useEffect(() => {
        getFilteredUsers();
    }, [filters]);

    return (
        <UsersContext.Provider value={{ ...state, onSearch, createFriendReques, refreshUserAtId, deleteFriendReques }}>
            {props.children}
        </UsersContext.Provider>
    );

    async function getFilteredUsers() {
        let usersCollectionRef = fireContext.db.collection(`users`);
        const filteredUsers = await usersCollectionRef.get();
        const returnableUsers = await Promise.all(
            filteredUsers.docs.map(async doc => {
                const friendRequest = await fireContext.db
                    .collection('friendRequestNumber')
                    .doc(doc.id)
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
                    profilePicture: doc.data().profilePicture,
                    tags: doc.data().tags,
                    requested: friendRequest.data()
                        ? friendRequest.data().requesters
                            ? friendRequest.data().requesters.find(element => element === fireContext.user.id)
                            : false
                        : false,
                };
            })
        );
        const users = (returnableUsers || [])
            .filter(filterByUserNameFn(filters.searchTerm))
            .filter(filterByMinCardsFn(filters.minCards))
            .filter(filterByMinPacksFn(filters.minPacks))
            .filter(filterByMinSubjectsFn(filters.minSubjects))
            .filter(filterByRoles(filters.roles))
            .filter(filterByTags(filters.tags))
            .sort(sortFn(filters.order[0], filters.order[1]));
        setState({ ...state, users: users });
    }

    async function createFriendReques(requestedId: string) {
        const friendRequestNumberRef = fireContext.db.collection('friendRequestNumber').doc(requestedId);
        const batch = fireContext.db.batch();
        const friendRequestNumber = await friendRequestNumberRef.get();
        if (friendRequestNumber.data() && friendRequestNumber.data().requesters) {
            const requesterArray = friendRequestNumber.data().requesters;
            requesterArray.push(fireContext.user.id);
            batch.update(friendRequestNumberRef, {
                counter: fireContext.increment,
                requesters: requesterArray,
                requestedId: requestedId,
            });
        } else {
            batch.set(friendRequestNumberRef, {
                counter: 1,
                requesters: [fireContext.user.id],
                requestedId: requestedId,
            });
        }
        batch.commit();
    }

    function refreshUserAtId() {}

    async function deleteFriendReques(requestedId: string) {
        const friendRequestNumberRef = fireContext.db.doc(`friendRequestNumber/${requestedId}`);
        const friendRequestNumber = await friendRequestNumberRef.get();
        if (friendRequestNumber.data().requesters.find(element => element === fireContext.user.id)) {
            const requesterArray = friendRequestNumber
                .data()
                .requesters.filter(element => element !== fireContext.user.id);
            friendRequestNumberRef.update({ counter: fireContext.decrement, requesters: requesterArray });
        }
        fireContext.refreshFriends();
    }

    async function onSearch(data: SearchData) {
        setState({ ...state, users: [] });

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
