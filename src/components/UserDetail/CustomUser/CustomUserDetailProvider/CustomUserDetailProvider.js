// @flow strict
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CustomUserDetailContext = React.createContext();

function CustomUserDetailProvider(props: { loadSize: number, userId: string, children: React$Node }) {
    const [state, setState] = useState({ customUser: undefined, dashboardFlow: [], lastVisible: null, hasMore: true });
    const [loading, setLoading] = useState(false);
    const fireContext = useContext(FirebaseContext);

    useEffect(() => {
        getUserData();
    }, []);
    useEffect(() => {
        if (state.customUser) getFirstPackages();
    }, [state.customUser]);

    return (
        <CustomUserDetailContext.Provider
            value={{
                ...state,
                loading,
                getUserData,
                getFirstPackages,
                getNextPackages,
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
                    setState({
                        ...state,
                        customUser: {
                            ...querySnapshot.data(),
                            id: props.userId,
                        },
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
        if (state.customUser.friends.includes(fireContext.user.id)) {
            const firstRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', state.customUser.id)
                .orderBy('createdBy.createdAt', 'desc')
                .limit(props.loadSize);

            const first = await firstRef.get();
            const lastVisible = first.docs[first.docs.length - 1];
            const savableDashboardFlow = await Promise.all(
                first.docs.map(async doc => {
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
                        package: { ...doc.data(), words },
                        user: { ...state.customUser, ...doc.data().createdBy },
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
                .where('createdBy.id', '==', state.customUser.id)
                .where('publicForEveryone', '==', true)
                .orderBy('createdBy.createdAt', 'desc')
                .limit(props.loadSize);

            const first = await firstRef.get();
            const lastVisible = first.docs[first.docs.length - 1];
            const savableDashboardFlow = await Promise.all(
                first.docs.map(async doc => {
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
                        package: { ...doc.data(), words },
                        user: { ...state.customUser, ...doc.data().createdBy },
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
        if (state.customUser.friends.includes(fireContext.user.id)) {
            const nextRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', state.customUser.id)
                .orderBy('createdBy.createdAt', 'desc')
                .startAfter(state.lastVisible)
                .limit(props.loadSize);

            const next = await nextRef.get();
            const lastVisible = next.docs[next.docs.length - 1];

            const savableDashboardFlow = await Promise.all(
                next.docs.map(async doc => {
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
                        package: { ...doc.data(), words },
                        user: { ...state.customUser, ...doc.data().createdBy },
                    };
                })
            );
            const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];
            setState({ ...state, dashboardFlow, lastVisible, hasMore: savableDashboardFlow.length === props.loadSize });
        } else {
            const nextRef = fireContext.db
                .collection('packages')
                .where('createdBy.id', '==', state.customUser.id)
                .where('publicForEveryone', '==', true)
                .orderBy('createdBy.createdAt', 'desc')
                .startAfter(state.lastVisible)
                .limit(props.loadSize);

            const next = await nextRef.get();
            const lastVisible = next.docs[next.docs.length - 1];

            const savableDashboardFlow = await Promise.all(
                next.docs.map(async doc => {
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
                        package: { ...doc.data(), words },
                        user: { ...state.customUser, ...doc.data().createdBy },
                    };
                })
            );
            const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];
            setState({ ...state, dashboardFlow, lastVisible, hasMore: savableDashboardFlow.length === props.loadSize });
        }
        /* ------------------------------------------- */
    }
}

export default CustomUserDetailProvider;
