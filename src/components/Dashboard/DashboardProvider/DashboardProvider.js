import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';

export const DashboardContext = React.createContext();

export default function DashboardProvider(props: { loadSize: number }) {
    const [state, setState] = useState({
        dashboardFlow: [],
        lastVisible: null,
        hasMore: false,
    });
    const [friends, setFriends] = useState([]);
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        getFriends().then(() => {
            getFirstPackages();
        });
    }, []);

    return (
        <DashboardContext.Provider value={{ ...state, getFirstPackages, getNextPackages }}>
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
            .orderBy('createdBy.createdAt', 'desc')
            .limit(props.loadSize);

        const first = await firstRef.get();
        const lastVisible = first.docs[first.docs.length - 1];

        const hasMore = first.docs.length === props.loadSize;

        const dashboardFlow = first.docs.filter(doc => {
            return friends.includes(doc.data().createdBy.id) || doc.data().publicForEveryone;
        });
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
                return { package: { ...doc.data(), words }, user: doc.data().createdBy };
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
        const nextRef = fireContext.db
            .collection('packages')
            .orderBy('createdBy.createdAt', 'desc')
            .startAfter(state.lastVisible)
            .limit(props.loadSize);

        const next = await nextRef.get();
        const lastVisible = next.docs[next.docs.length - 1];

        const hasMore = next.docs.length === props.loadSize;

        const dashboardFlowNext = next.docs.filter(doc => {
            return friends.includes(doc.data().createdBy.id) || doc.data().publicForEveryone;
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
                return { package: { ...doc.data(), words }, user: doc.data().createdBy };
            })
        );
        const dashboardFlow = [...state.dashboardFlow, ...savableDashboardFlow];

        setState({ ...state, dashboardFlow, lastVisible, hasMore: hasMore });
    }
}
