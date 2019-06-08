// @flow strict
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CustomUserDetailContext = React.createContext();

function CustomUserDetailProvider(props: { userId: string, children: React$Node }) {
    const [state, setState] = useState({ customUser: undefined, dashboardFlow: [], lastVisible: null, hasMore: true });
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const fireContext = useContext(FirebaseContext);

    useEffect(() => {
        getUserData();
        getFriends();
    }, []);

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

    async function getFriends(params) {
        return new Promise(async (resolve, reject) => {
            const userData = await fireContext.db
                .collection('users')
                .doc(fireContext.user.id)
                .get();
            if (userData.data().friends) {
                setFriends([...userData.data().friends, fireContext.user.id]);
            } else {
                setFriends([fireContext.user.id]);
            }
            resolve();
        });
    }

    async function getFirstPackages() {
        setLoading(true);
        const firstRef = fireContext.db
            .collection('packages')
            .orderBy('subjectId')
            .limit(props.loadSize);

        const first = await firstRef.get();
        const lastVisible = first.docs[first.docs.length - 1];
        const dashboardFlow = first.docs.filter(async doc => friends.includes(doc.data().createdBy.id));

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
                return { package: { title: doc.data().packageName, words }, user: doc.data().createdBy };
            })
        );
        setState({
            ...state,
            dashboardFlow: savableDashboardFlow,
            lastVisible,
            hasMore: savableDashboardFlow.length === props.loadSize,
        });
        setLoading(false);
    }

    async function getNextPackages() {
        setLoading(true);
        const nextRef = fireContext.db
            .collection('packages')
            .orderBy('subjectId')
            .startAfter(state.lastVisible)
            .limit(props.loadSize);

        const next = await nextRef.get();
        const lastVisible = next.docs[next.docs.length - 1];
        const dashboardFlowNext = next.docs.filter(doc => {
            return friends.includes(doc.data().createdBy.id);
        });

        const savableDashboardFlow = await Promise.all(
            dashboardFlowNext.map(async doc => {
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
                return { package: { title: doc.data().packageName, words }, user: doc.data().createdBy };
            })
        );
        const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];
        setState({ ...state, dashboardFlow, lastVisible, hasMore: savableDashboardFlow.length === props.loadSize });
        setLoading(false);
    }
}

export default CustomUserDetailProvider;
