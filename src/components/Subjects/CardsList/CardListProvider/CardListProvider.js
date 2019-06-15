import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CardListContext = React.createContext();
export const CardListConsumer = CardListContext.Consumer;

export default function CardListProvider(props) {
    const [state, setState] = useState({
        cardsOfPackage: {},
        packageInformations: {
            cardsNumber: 0,
            correctsNumber: 0,
            incorrectsNumber: 0,
            publicForEveryone: false,
            publicForFriends: false,
        },
    });
    const [loading, setLoading] = useState(true);
    const fireContext = useContext(FirebaseContext);

    return (
        <CardListContext.Provider
            value={{
                ...state,
                loading,
                getCardsByPackageId,
                createNewCardForPackage,
                updateCard,
                deleteCardById,
            }}
        >
            {props.children}
        </CardListContext.Provider>
    );

    function createNewCardForPackage(
        packageId,
        front: { image: any, imageUrl: string, word: string, example: string },
        back: { image: any, imageUrl: string, word: string, example: string }
    ) {
        setLoading(true);
        uploadImage(front).then(frontUrl => {
            uploadImage(back).then(backUrl => {
                setLoading(false);
                const batch = fireContext.db.batch();
                const cardsRef = fireContext.db.collection('cards').doc();
                const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
                const packageRef = fireContext.db.collection('packages').doc(packageId);
                batch.set(cardsRef, {
                    front: { imageUrl: frontUrl, word: front.word, example: front.example },
                    back: { imageUrl: backUrl, word: back.word, example: back.example },
                    packageId,
                    knowledge: 1,
                    correct: null,
                    createdAt: fireContext.getDateTime(),
                });
                batch.update(packageRef, { cardsNumber: fireContext.increment });
                batch.update(userRef, { cardsNumber: fireContext.increment });
                batch.commit();
                getCardsByPackageId(packageId);
            });
        });
    }

    function getCardsByPackageId(packageId) {
        setLoading(true);
        fireContext
            .getCardsByPackageId(packageId)
            .then(async querySnapshot => {
                const cardsOfPackage = state.cardsOfPackage;
                cardsOfPackage[packageId] = [];
                querySnapshot.forEach(doc => {
                    cardsOfPackage[packageId].push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
                const pack = await fireContext.db
                    .collection('packages')
                    .doc(packageId)
                    .get();
                setState({
                    ...state,
                    selectedPackageId: packageId,
                    cardsOfPackage,
                    packageInformations: {
                        cardsNumber: pack.data().cardsNumber,
                        correctsNumber: pack.data().correctsNumber,
                        incorrectsNumber: pack.data().incorrectsNumber,
                        publicForEveryone: pack.data().publicForEveryone,
                        publicForFriends: pack.data().publicForFriends,
                    },
                });
                setLoading(false);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
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
                correct: null,
                createdAt: fireContext.getDateTime(),
            })
            .then(function() {
                console.log('Document successfully updated!');
                getCardsByPackageId(packageId);
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    }

    function deleteCardById(cardId: string, packageId: string) {
        fireContext
            .deleteCardById(cardId)
            .then(() => {
                const batch = fireContext.db.batch();
                const packageRef = fireContext.db.collection('packages').doc(packageId);
                const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
                batch.update(packageRef, { cardsNumber: fireContext.decrement });
                batch.update(userRef, { cardsNumber: fireContext.decrement });
                batch.commit();
                getCardsByPackageId(packageId);
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }

    async function uploadImage(side) {
        return new Promise(async (resolve, reject) => {
            if (side.image) {
                const storageRef = fireContext.storage.ref('cardImages');
                const imageRef = await storageRef.child(Math.random() + side.image.name);
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
}
