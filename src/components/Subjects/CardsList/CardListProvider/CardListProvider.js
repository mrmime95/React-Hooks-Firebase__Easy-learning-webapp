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
                            imageUrl: doc.data().front.imageUrl,
                            example: doc.data().front.example,
                        },
                        back: {
                            word: doc.data().back.word,
                            imageUrl: doc.data().back.imageUrl,
                            example: doc.data().back.example,
                        },
                        knowledge: doc.data().knowledge,
                    });
                });

                console.log(state);
                setState({ ...state, selectedPackageId: packageId, cardsOfPackage });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }

    async function uploadImage(side) {
        return new Promise(async (resolve, reject) => {
            if (side.image) {
                const storageRef = fireContext.storage.ref('cardImages');
                const imageRef = await storageRef.child(Math.random() + side.image.name);
                console.log(side.image);
                const uploadImage = imageRef.put(side.image);
                uploadImage.on(
                    'state_changed',
                    snapshot => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    error => {
                        console.log('Front image Uploading error:', error);
                        reject(error);
                    },
                    () => {
                        resolve(uploadImage.snapshot.ref.getDownloadURL());
                    }
                );
            } else {
                resolve(side.imageUrl);
            }
        });
    }

    async function createNewCardForPackage(
        packageId,
        front: { image: any, imageUrl: string, word: string, example: string },
        back: { image: any, imageUrl: string, word: string, example: string }
    ) {
        const frontUrl = await uploadImage(front);
        const backUrl = await uploadImage(back);
        const batch = fireContext.db.batch();
        const cardsRef = fireContext.db.collection('cards').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
        batch.set(cardsRef, {
            front: { imageUrl: frontUrl, word: front.word, example: front.example },
            back: { imageUrl: backUrl, word: back.word, example: back.example },
            packageId,
            knowledge: 1,
        });
        batch.update(userRef, { cardsNumber: fireContext.increment });
        batch.commit();
        getCardsByPackageId(packageId);
    }

    async function updateCard(
        packageId: string,
        cardId: string,
        front: { image: any, imageUrl: string, word: string, example: string },
        back: { image: any, imageUrl: string, word: string, example: string }
    ) {
        const frontUrl = await uploadImage(front);
        const backUrl = await uploadImage(back);
        fireContext.db
            .doc(`cards/${cardId}`)
            .update({
                front: { imageUrl: frontUrl, word: front.word, example: front.example },
                back: { imageUrl: backUrl, word: back.word, example: back.example },
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
