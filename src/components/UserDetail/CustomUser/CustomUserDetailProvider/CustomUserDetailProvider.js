// @flow strict
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CustomUserDetailContext = React.createContext();

export default function CustomUserDetailProvider(props: { loadSize: number, userId: string, children: React$Node }) {
    const [state, setState] = useState({ dashboardFlow: [], lastVisible: null, hasMore: true });
    const [loading, setLoading] = useState(false);
    const [customUser, setCustomUser] = useState(undefined);
    const fireContext = useContext(FirebaseContext);

    const [otherFileters, setOtherFilters] = useState({
        searchTerm: '',
        minCards: 0,
        minCorrect: 0,
        maxIncorrect: Number.POSITIVE_INFINITY,
        publicsOnly: false,
        tags: [],
    });
    const [orderBy, setOrderBy] = useState(props.orderBy);

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (customUser) getFirstPackages();
    }, [customUser, otherFileters, orderBy]);

    return (
        <CustomUserDetailContext.Provider
            value={{
                ...state,
                loading,
                getUserData,
                getFirstPackages,
                getNextPackages,
                onSearch,
                customUser,
            }}
        >
            {props.children}
        </CustomUserDetailContext.Provider>
    );

    function getUserData() {
        setLoading(true);
        fireContext.db
            .doc(`users/${props.userId}`)
            .get()
            .then(async querySnapshot => {
                if (querySnapshot.data()) {
                    setCustomUser({
                        ...querySnapshot.data(),
                        id: props.userId,
                    });
                }

                setLoading(false);
            })
            .catch(function(error) {
                console.log('Error getting user document: ', error);
            });
    }

    async function getFirstPackages() {
        /* --------------user-------------- */
        if (customUser.friends.includes(fireContext.user.id)) {
            const firstRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', customUser.id)
                .orderBy(orderBy[0], orderBy[1])
                .limit(props.loadSize);

            const first = await firstRef.get();
            const lastVisible = first.docs[first.docs.length - 1];
            const savableDashboardFlow = await Promise.all(
                first.docs
                    .filter(filterByPackageNameFn(otherFileters.searchTerm))
                    .filter(filterByMinCardsFn(otherFileters.minCards))
                    .filter(filterByMinCorrectFn(otherFileters.minCorrect))
                    .filter(filterByMaxInCorrectFn(otherFileters.maxIncorrect))
                    .filter(filterByPublicsFn(otherFileters.publicsOnly))
                    .filter(filterByTagsFn(otherFileters.tags))
                    .map(async doc => {
                        const cards = await fireContext.getCardsByPackageId(doc.id);
                        const words = await Promise.all(
                            cards.docs.map(async (card, index) => {
                                return {
                                    front: card.data().front,
                                    back: card.data().back,
                                    correct: card.data().correct,
                                    cardId: card.id,
                                };
                            })
                        );
                        return {
                            package: { ...doc.data(), id: doc.id, words },
                            user: { ...customUser, ...doc.data().createdBy, link: '/user/' + customUser.id },
                        };
                    })
            );

            setState({
                ...state,
                dashboardFlow: savableDashboardFlow,
                lastVisible,
                hasMore: savableDashboardFlow.length === props.loadSize,
            });
        } else {
            const firstRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', customUser.id)
                .orderBy('createdBy.createdAt', 'desc')
                .limit(props.loadSize);

            const first = await firstRef.get();
            const lastVisible = first.docs[first.docs.length - 1];
            const savableDashboardFlow = await Promise.all(
                first.docs
                    .filter(doc => {
                        if (
                            fireContext.user.role === 'approver' &&
                            compareArrays(fireContext.user.tags, doc.data().tags)
                        ) {
                            return true;
                        }
                        if (fireContext.user.role === 'admin') {
                            return true;
                        }
                        return doc.data().publicForEveryone;
                    })
                    .filter(filterByPackageNameFn(otherFileters.searchTerm))
                    .filter(filterByMinCardsFn(otherFileters.minCards))
                    .filter(filterByMinCorrectFn(otherFileters.minCorrect))
                    .filter(filterByMaxInCorrectFn(otherFileters.maxIncorrect))
                    .filter(filterByPublicsFn(otherFileters.publicsOnly))
                    .filter(filterByTagsFn(otherFileters.tags))
                    .map(async doc => {
                        const cards = await fireContext.getCardsByPackageId(doc.id);
                        const words = await Promise.all(
                            cards.docs.map(async (card, index) => {
                                return {
                                    front: card.data().front,
                                    back: card.data().back,
                                    correct: card.data().correct,
                                    cardId: card.id,
                                };
                            })
                        );
                        return {
                            package: { ...doc.data(), id: doc.id, words },
                            user: { ...customUser, ...doc.data().createdBy, link: '/user/' + customUser.id },
                        };
                    })
            );
            setState({
                ...state,
                dashboardFlow: savableDashboardFlow,
                lastVisible,
                hasMore: savableDashboardFlow.length === props.loadSize,
            });
        }
        /* ------------------------------------------- */
    }

    async function getNextPackages() {
        /* --------------user-------------- */
        if (customUser.friends.includes(fireContext.user.id)) {
            const nextRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', customUser.id)
                .orderBy(orderBy[0], orderBy[1])
                .startAfter(state.lastVisible)
                .limit(props.loadSize);

            const next = await nextRef.get();
            const lastVisible = next.docs[next.docs.length - 1];

            const savableDashboardFlow = await Promise.all(
                next.docs
                    .filter(filterByPackageNameFn(otherFileters.searchTerm))
                    .filter(filterByMinCardsFn(otherFileters.minCards))
                    .filter(filterByMinCorrectFn(otherFileters.minCorrect))
                    .filter(filterByMaxInCorrectFn(otherFileters.maxIncorrect))
                    .filter(filterByPublicsFn(otherFileters.publicsOnly))
                    .filter(filterByTagsFn(otherFileters.tags))
                    .map(async doc => {
                        const cards = await fireContext.getCardsByPackageId(doc.id);
                        const words = await Promise.all(
                            cards.docs.map(async (card, index) => {
                                return {
                                    front: card.data().front,
                                    back: card.data().back,
                                    correct: card.data().correct,
                                    cardId: card.id,
                                };
                            })
                        );
                        return {
                            package: { ...doc.data(), id: doc.id, words },
                            user: { ...customUser, ...doc.data().createdBy, link: '/user/' + customUser.id },
                        };
                    })
            );

            const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];
            setState({ ...state, dashboardFlow, lastVisible, hasMore: savableDashboardFlow.length === props.loadSize });
        } else {
            const nextRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', customUser.id)
                .orderBy('createdBy.createdAt', 'desc')
                .startAfter(state.lastVisible)
                .limit(props.loadSize);

            const next = await nextRef.get();
            const lastVisible = next.docs[next.docs.length - 1];

            const savableDashboardFlow = await Promise.all(
                next.docs
                    .filter(doc => {
                        if (
                            fireContext.user.role === 'approver' &&
                            compareArrays(fireContext.user.tags, doc.data().tags)
                        ) {
                            return true;
                        }
                        if (fireContext.user.role === 'admin') {
                            return true;
                        }
                        return doc.data().publicForEveryone;
                    })
                    .filter(filterByPackageNameFn(otherFileters.searchTerm))
                    .filter(filterByMinCardsFn(otherFileters.minCards))
                    .filter(filterByMinCorrectFn(otherFileters.minCorrect))
                    .filter(filterByMaxInCorrectFn(otherFileters.maxIncorrect))
                    .filter(filterByPublicsFn(otherFileters.publicsOnly))
                    .filter(filterByTagsFn(otherFileters.tags))
                    .map(async doc => {
                        const cards = await fireContext.getCardsByPackageId(doc.id);
                        const words = await Promise.all(
                            cards.docs.map(async (card, index) => {
                                return {
                                    front: card.data().front,
                                    back: card.data().back,
                                    correct: card.data().correct,
                                    cardId: card.id,
                                };
                            })
                        );
                        return {
                            package: { ...doc.data(), id: doc.id, words },
                            user: { ...customUser, ...doc.data().createdBy, link: '/user/' + customUser.id },
                        };
                    })
            );
            const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];
            setState({ ...state, dashboardFlow, lastVisible, hasMore: savableDashboardFlow.length === props.loadSize });
        }
        /* ------------------------------------------- */
    }
    function onSearch(data) {
        console.log(data);
        const ordBy = getOrder(data.sort.value);
        setState({ dashboardFlow: [], lastVisible: null, hasMore: false });
        if (orderBy[0] !== ordBy[0] || orderBy[1] !== ordBy[1]) {
            setOrderBy([ordBy[0], ordBy[1]]);
        } else {
            setOtherFilters({
                searchTerm: data.searchTerm || '',
                minCards: data.minCards || 0,
                minCorrect: data.minCorrect || 0,
                maxIncorrect: data.maxIncorrect || Number.POSITIVE_INFINITY,
                publicsOnly: data.publicsOnly || false,
                tags: data.tags.map(tag => tag.text) || [],
            });
        }
    }

    function getOrder(sort: string): [string, string] {
        const sortArray = sort.split('_');
        let sortBy;
        switch (sortArray[0]) {
            case 'name':
                sortBy = 'createdBy.fullName';
                break;
            case 'cards-number':
                sortBy = 'cardsNumber';
                break;
            case 'corrects-number':
                sortBy = 'correctsNumber';
                break;
            case 'incorrects-number':
                sortBy = 'incorrectsNumber';
                break;
            case 'pack-name':
                sortBy = 'packageName';
                break;
            default:
                sortBy = 'createdBy.createdAt';
                break;
        }
        return [sortBy, sortArray[1]];
    }
    function compareArrays(usersTags: [string], packagesTags: [string]) {
        if (usersTags.length && packagesTags.length) {
            return usersTags.filter(x => packagesTags.includes(x)).length !== 0;
        }
        return true;
    }
}

function filterByPackageNameFn(name: string) {
    return row => {
        console.log(row.data());
        return (
            row
                .data()
                .packageName.toUpperCase()
                .indexOf(name.toUpperCase()) >= 0
        );
    };
}
function filterByMinCardsFn(minCardsNumber: number) {
    return row => {
        return row.data().cardsNumber >= minCardsNumber;
    };
}
function filterByMinCorrectFn(minCorrectsNumber: number) {
    return row => {
        return row.data().correctsNumber >= minCorrectsNumber;
    };
}

function filterByMaxInCorrectFn(maxIncorrectsNumber: number) {
    return row => {
        return row.data().incorrectsNumber <= maxIncorrectsNumber;
    };
}

function filterByPublicsFn(publicsOnly: boolean) {
    if (publicsOnly) {
        return row => {
            return row.data().publicForEveryone;
        };
    }
    return row => true;
}

function filterByTagsFn(tags: [string]) {
    if (tags.length === 0) return row => row;
    return row => {
        console.log(row.data().tags);
        return tags.findIndex(tag => tag.toUpperCase() === row.data().tags.toUpperCase()) >= 0;
    };
}
