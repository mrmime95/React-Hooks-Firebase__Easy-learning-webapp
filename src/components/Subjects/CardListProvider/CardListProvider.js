import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
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
            }}
        >
            {props.children}
        </CardListContext.Provider>
    );

    function getCardsByPackageId(packageId) {
        console.log(packageId);
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
        return fireContext.db
            .collection('cards')
            .add({
                front,
                back,
                packageId,
            })
            .then(() => {
                console.log('card saved');
                getCardsByPackageId(packageId);
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
    }
}
