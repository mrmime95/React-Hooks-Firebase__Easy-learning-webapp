import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';

export const DashboardContext = React.createContext();

export default function DashboardProvider(props: { loadSize: number, orderBy: [string, string] }) {
    const [state, setState] = useState({
        dashboardFlow: [],
        lastVisible: null,
        hasMore: false,
    });
    const [friends, setFriends] = useState(null);
    const [otherFileters, setOtherFilters] = useState({
        searchTerm: '',
        minCards: 0,
        minCorrect: 0,
        maxIncorrect: Number.POSITIVE_INFINITY,
        publicsOnly: false,
        tags: [],
    });
    const [orderBy, setOrderBy] = useState(props.orderBy);
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        getFriends();
    }, []);

    useEffect(() => {
        if (friends) {
            getFirstPackages();
        }
    }, [friends, orderBy, otherFileters]);

    return (
        <DashboardContext.Provider value={{ ...state, getFirstPackages, getNextPackages, onSearch }}>
            {props.children}
        </DashboardContext.Provider>
    );
    async function getFriends(params) {
        return new Promise(async (resolve, reject) => {
            const userData = await fireContext.db
                .collection('users')
                .doc(fireContext.user.id)
                .get();
            if (userData.data().friends) {
                setFriends([...userData.data().friends]);
            } else {
                setFriends([]);
            }
            resolve();
        });
    }

    async function getFirstPackages() {
        const firstRef = fireContext.db
            .collection('packages')
            .orderBy(orderBy[0], orderBy[1])
            .limit(props.loadSize);

        const first = await firstRef.get();
        const lastVisible = first.docs[first.docs.length - 1];

        const hasMore = first.docs.length === props.loadSize;

        const dashboardFlow = first.docs
            .filter(doc => {
                if (
                    fireContext.user.role === 'approver' &&
                    compareArrays(fireContext.user.approverAt, doc.data().tags)
                ) {
                    return true;
                }
                if (fireContext.user.role === 'admin') {
                    return true;
                }
                return friends.includes(doc.data().createdBy.id) || doc.data().publicForEveryone;
            })
            .filter(filterByPackageNameFn(otherFileters.searchTerm))
            .filter(filterByMinCardsFn(otherFileters.minCards))
            .filter(filterByMinCorrectFn(otherFileters.minCorrect))
            .filter(filterByMaxInCorrectFn(otherFileters.maxIncorrect))
            .filter(filterByPublicsFn(otherFileters.publicsOnly))
            .filter(filterByTagsFn(otherFileters.tags));

        const savableDashboardFlow = await Promise.all(
            dashboardFlow.map(async doc => {
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
                const createdBy = await fireContext.getCreatedBy(doc.data().createdBy.id);
                return { package: { ...doc.data(), id: doc.id, words }, user: createdBy };
            })
        );
        setState({
            ...state,
            dashboardFlow: savableDashboardFlow,
            lastVisible,
            hasMore: hasMore,
        });
    }

    async function getNextPackages() {
        if (state.lastVisible) {
            const nextRef = fireContext.db
                .collection('packages')
                .orderBy(orderBy[0], orderBy[1])
                .startAfter(state.lastVisible)
                .limit(props.loadSize);

            const next = await nextRef.get();
            const lastVisible = next.docs[next.docs.length - 1];

            const hasMore = next.docs.length === props.loadSize;
            const dashboardFlowNext = next.docs
                .filter(doc => {
                    if (
                        fireContext.user.role === 'approver' &&
                        compareArrays(fireContext.user.approverAt, doc.data().tags)
                    ) {
                        return true;
                    }
                    if (fireContext.user.role === 'admin') {
                        return true;
                    }
                    return friends.includes(doc.data().createdBy.id) || doc.data().publicForEveryone;
                })
                .filter(filterByPackageNameFn(otherFileters.searchTerm))
                .filter(filterByMinCardsFn(otherFileters.minCards))
                .filter(filterByMinCorrectFn(otherFileters.minCorrect))
                .filter(filterByMaxInCorrectFn(otherFileters.maxIncorrect))
                .filter(filterByPublicsFn(otherFileters.publicsOnly))
                .filter(filterByTagsFn(otherFileters.tags));

            const savableDashboardFlow = await Promise.all(
                dashboardFlowNext.map(async doc => {
                    const cards = await fireContext.getCardsByPackageId(doc.id);
                    const words = cards.docs.map((card, index) => {
                        return {
                            front: card.data().front,
                            back: card.data().back,
                            correct: card.data().correct,
                            cardId: card.id,
                        };
                    });
                    const createdBy = await fireContext.getCreatedBy(doc.data().createdBy.id);
                    return { package: { ...doc.data(), id: doc.id, words }, user: createdBy };
                })
            );
            const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];

            setState({ ...state, dashboardFlow, lastVisible, hasMore: hasMore });
        }
    }

    function onSearch(data) {
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
        return false;
    }
}

function filterByPackageNameFn(name: string) {
    return row => {
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
    return row => {
        return tags.every(tag => row.data().tags.includes(tag));
    };
}
