import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CardListContext = React.createContext();
export const CardListConsumer = CardListContext.Consumer;

export default function CardListProvider(props) {
    const [state, setState] = useState({
        cardsOfPackage: {},
    });
    const fireContext = useContext(FirebaseContext);

    return (
        <CardListContext.Provider
            value={{
                ...state,
                getCardsByPackageId,
                createNewCardForPackage,
                updateCard,
            }}
        >
            {props.children}
        </CardListContext.Provider>
    );

    function getCardsByPackageId(packageId) {
        fireContext
            .getCardsByPackageId(packageId)
            .then(querySnapshot => {
                const cardsOfPackage = state.cardsOfPackage;
                cardsOfPackage[packageId] = [];
                querySnapshot.forEach(doc => {
                    cardsOfPackage[packageId].push({
                        id: doc.id,
                        front: {
                            word: doc.data().front.word,
                            image: doc.data().front.image,
                            example: doc.data().front.example,
                        },
                        back: {
                            word: doc.data().back.word,
                            image: doc.data().back.image,
                            example: doc.data().back.example,
                        },
                    });
                });

                console.log(state);
                setState({ ...state, selectedPackageId: packageId, cardsOfPackage });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }

    function createNewCardForPackage(
        packageId,
        front: { image: string, imageUrl: string, word: string, example: string },
        back: { image: string, imageUrl: string, word: string, example: string }
    ) {
        const batch = fireContext.db.batch();
        const cardsRef = fireContext.db.collection('cards').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
        batch.set(cardsRef, {
            front,
            back,
            packageId,
            knowledge: 0,
        });
        batch.update(userRef, { cardsNumber: fireContext.increment });
        batch.commit();
        getCardsByPackageId(packageId);
    }

    function updateCard(
        packageId: string,
        cardId: string,
        front: { example: string, image: string, word: string },
        back: { example: string, image: string, word: string }
    ) {
        fireContext.db
            .doc(`cards/${cardId}`)
            .update({
                front: front,
                back: back,
            })
            .then(function() {
                console.log('Document successfully updated!');
                getCardsByPackageId(packageId);
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    }
}
