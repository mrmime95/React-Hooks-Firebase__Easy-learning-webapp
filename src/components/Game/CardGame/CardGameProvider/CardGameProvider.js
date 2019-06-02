import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
import { GameContext } from '../../GameProvider/GameProvider';
export const CardGameContext = React.createContext();

export default function CardGameProvider(props: { children: React$Node }) {
    const [randomCards, setRandomCards] = useState([]);
    const fireContext = useContext(FirebaseContext);
    const context = useContext(GameContext);

    useEffect(() => getCardsRandomly(context.showingCards), []);

    return (
        <CardGameContext.Provider value={{ randomCards, changeKwnowledgeOfCard, setBack }}>
            {props.children}
        </CardGameContext.Provider>
    );

    function getCardsRandomly(
        cards: Array<{
            id?: string,
            back: {
                example: string,
                image: string,
                word: string,
            },
            front: {
                example: string,
                image: string,
                word: string,
            },
            knowledge: number,
            packageId: string,
        }>
    ) {
        setRandomCards(cards.sort(() => Math.random() - 0.5));
    }

    async function changeKwnowledgeOfCard(cardId: string, value: number) {
        const currentCardRef = fireContext.db.doc(`cards/${cardId}`);
        const batch = fireContext.db.batch();
        batch.update(currentCardRef, {
            knowledge: value,
        });
        batch.commit();
    }

    function setBack() {
        context.setToDefault();
    }
}
