import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';

export const DashboardContext = React.createContext();

export default function DashboardProvider(props: { loadSize: number }) {
    const [state, setState] = useState({
        dashboardFlow: [],
        lastVisible: null,
        hasMore: true,
    });
    const [loading, setLoading] = useState(true);
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
        getFirstPackages();
    }, []);

    return (
        <DashboardContext.Provider value={{ ...state, loading, getFirstPackages, getNextPackages }}>
            {props.children}
        </DashboardContext.Provider>
    );

    async function getFirstPackages() {
        setLoading(true);
        const firstRef = fireContext.db
            .collection('packages')
            .orderBy('subjectId')
            .limit(props.loadSize);

        const first = await firstRef.get();
        const lastVisible = first.docs[first.docs.length - 1];
        const dashboardFlow = await Promise.all(
            first.docs.map(async doc => {
                const cards = await fireContext.getCardsByPackageId(doc.id);
                const words = await Promise.all(
                    cards.docs.map(async (card, index) => {
                        return { front: card.data().front, back: card.data().back, correct: card.data().correct };
                    })
                );
                return { package: { title: doc.data().packageName, words }, user: doc.data().createdBy };
            })
        );
        setState({ ...state, dashboardFlow, lastVisible, hasMore: dashboardFlow.length === props.loadSize });
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
        const dashboardFlowNext = await Promise.all(
            next.docs.map(async doc => {
                const cards = await fireContext.getCardsByPackageId(doc.id);
                const words = await Promise.all(
                    cards.docs.map(async (card, index) => {
                        return { front: card.data().front, back: card.data().back, correct: card.data().correct };
                    })
                );
                return { package: { title: doc.data().packageName, words }, user: doc.data().createdBy };
            })
        );
        const dashboardFlow = [...state.dashboardFlow, ...dashboardFlowNext];
        setState({ ...state, dashboardFlow, lastVisible, hasMore: dashboardFlowNext.length === props.loadSize });
        setLoading(false);
    }
}
