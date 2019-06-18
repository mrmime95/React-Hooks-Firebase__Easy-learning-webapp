import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import Papa from 'papaparse';
export const SubjectsContext = React.createContext();
export const SubjectsConsumer = SubjectsContext.Consumer;

export default function SubjectsProvider(props) {
    const [state, setState] = useState({
        subjects: null,
        packages: {},
        selectedPackageId: '',
        selectedSubjectId: '',
    });
    const fireContext = useContext(FirebaseContext);
    useEffect(getSubjectsByCurrentUser, []);
    return (
        <SubjectsContext.Provider
            value={{
                ...state,
                createNewSubject,
                createNewPackageForSubject,
                getPackagesBySubjectId,
                getSubjectsByCurrentUser,
                setSelectedPackage,
                setSelectedSubject,
                updateSubject,
                updatePackagesAtSubject,
                deletePackageById,
                deleteSubjectById,
                downloadPackage,
                fileChangedHandler,
            }}
        >
            {props.children}
        </SubjectsContext.Provider>
    );
    function setSelectedPackage(packageId) {
        packageId === state.selectedPackageId
            ? setState({ ...state, selectedPackageId: '' })
            : setState({ ...state, selectedPackageId: packageId });
    }
    function setSelectedSubject(subjectId) {
        subjectId === state.selectedSubjectId
            ? setState({ ...state, selectedSubjectId: '' })
            : setState({ ...state, selectedSubjectId: subjectId });
    }

    /* ------------subjects CRUD---------- */

    function createNewSubject(subjectName: string) {
        const batch = fireContext.db.batch();
        const subjectsRef = fireContext.db.collection('subjects').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
        batch.set(subjectsRef, {
            subjectName,
            userId: fireContext.user.id,
            createdAt: fireContext.getDateTime(),
        });
        batch.update(userRef, { subjectsNumber: fireContext.increment });
        batch.commit();
    }

    function getSubjectsByCurrentUser() {
        fireContext
            .getSubjectsByCurrentUser()
            .then(querySnapshot => {
                const subjects = [];
                querySnapshot.forEach(doc => {
                    subjects.push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
                setState({ ...state, subjects });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }
    function updateSubject(subjectId: string, values: { subjectName: string }) {
        fireContext.db
            .doc(`subjects/${subjectId}`)
            .update({
                ...values,
                createdAt: fireContext.getDateTime(),
            })
            .then(function() {
                console.log('Document successfully updated!');
                getSubjectsByCurrentUser();
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    }

    /* ---------------------------------------- */

    /* ------------packages CRUD---------- */

    function createNewPackageForSubject(
        subjectId: string,
        values: {
            packageName: string,
            publicForEveryone: boolean,
            tags: [{ id: string, text: string }],
        }
    ) {
        const batch = fireContext.db.batch();
        const packagesRef = fireContext.db.collection('packages').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);

        batch.set(packagesRef, {
            ...values,
            tags: values.tags.map(tag => tag.id),
            cardsNumber: 0,
            correctsNumber: 0,
            incorrectsNumber: 0,
            subjectId,
            createdBy: {
                id: fireContext.user.id,
                fullName: `${fireContext.user.firstName} ${fireContext.user.lastName}`,
                createdAt: fireContext.getDateTime(),
            },
        });
        batch.update(userRef, { packagesNumber: fireContext.increment });
        batch.commit();
        return packagesRef.id;
    }
    function getPackagesBySubjectId(subjectId: string) {
        fireContext
            .getPackagesBySubjectId(subjectId)
            .then(querySnapshot => {
                const packages = state.packages;
                packages[subjectId] = [];
                querySnapshot.forEach(doc => {
                    packages[subjectId].push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
                setState({ ...state, packages });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }

    function updatePackagesAtSubject(
        subjectId: string,
        packId: string,
        values: {
            packageName: string,
            publicForFriends: boolean,
            publicForEveryone: boolean,
            tags: [{ id: string, text: string }],
        }
    ) {
        fireContext.db
            .doc(`packages/${packId}`)
            .update({
                ...values,
                tags: values.tags.map(tag => tag.id),
                createdAt: fireContext.getDateTime(),
            })
            .then(function() {
                console.log('Document successfully updated!');
                getPackagesBySubjectId(subjectId);
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    }
    /* ---------------------------------------- */

    async function deleteSubjectById(subjectId: string) {
        setState({ ...state, subjects: null });
        fireContext
            .deleteSubjectById(subjectId)
            .then(() => {
                const batch = fireContext.db.batch();
                const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
                batch.update(userRef, { subjectsNumber: fireContext.decrement });
                fireContext.db
                    .collection('packages')
                    .where('subjectId', '==', subjectId)
                    .get()
                    .then(packs => {
                        packs.forEach((pack, index) => {
                            deletePackageById(pack.id, subjectId, true);
                        });

                        getSubjectsByCurrentUser();
                    })
                    .catch(error => {
                        console.error('Error removing document: ', error);
                    });
                batch.commit();
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }

    /* ---------------------------------------- */

    async function deletePackageById(packageId: string, subjectId: string, subjectDeleting: boolean) {
        fireContext
            .deletePackageById(packageId)
            .then(() => {
                const batch = fireContext.db.batch();
                const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
                batch.update(userRef, { packagesNumber: fireContext.decrement });
                fireContext.db
                    .collection('cards')
                    .where('packageId', '==', packageId)
                    .get()
                    .then(cards => {
                        cards.forEach((card, index) => {
                            deleteCardById(card.id, packageId);
                        });
                        if (!subjectDeleting) {
                            getPackagesBySubjectId(subjectId);
                        }
                    })
                    .catch(error => {
                        console.error('Error removing document: ', error);
                    });
                batch.commit();
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }
    /* ---------------------------------------- */

    function deleteCardById(cardId: string, packageId: string) {
        fireContext
            .deleteCardById(cardId)
            .then(() => {
                const batch = fireContext.db.batch();
                const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
                batch.update(userRef, { cardsNumber: fireContext.decrement });
                batch.commit();
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }
    /* ---------------------------------------- */

    function downloadPackage(packageId: string) {
        fireContext.db
            .doc(`packages/${packageId}`)
            .get()
            .then(querySnapshot => {
                const packageName = querySnapshot.data().packageName;
                fireContext.db
                    .collection(`cards`)
                    .where('packageId', '==', packageId)
                    .get()
                    .then(cardsSnapshot => {
                        const cardsFront = [];
                        const cardsBack = [];
                        cardsSnapshot.forEach(card => {
                            cardsFront.push({ ...card.data().front });
                            cardsBack.push({ ...card.data().back });
                        });
                        console.log(packageName, cardsFront, cardsBack);
                        downloadCSV(
                            convertPackageToCSV(packageName, cardsFront, cardsBack),
                            'easy-learning_package_' + packageName + '_' + fireContext.getDateTime()
                        );
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    function convertPackageToCSV(packageName, front, back) {
        const csvRows = [];
        csvRows.push(['"packageName","' + packageName + '"']);
        csvRows.push([]);
        csvRows.push(['"wordFront","wordBack","exampleFront","exampleBack","imageUrlFront","imageUrlBack"']);

        front.forEach((frontSide, index) => {
            const result = [];
            result.push(`"${('' + frontSide.word).replace(/"/g, '\\"')}"`);
            result.push(`"${('' + back[index].word).replace(/"/g, '\\"')}"`);
            result.push(`"${('' + frontSide.example).replace(/"/g, '\\"')}"`);
            result.push(`"${('' + back[index].example).replace(/"/g, '\\"')}"`);
            result.push(`"${('' + frontSide.imageUrl).replace(/"/g, '\\"')}"`);
            result.push(`"${('' + back[index].imageUrl).replace(/"/g, '\\"')}"`);

            csvRows.push(result.join(','));
        });
        return csvRows.join('\n');
    }

    function downloadCSV(csv, fileName) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function fileChangedHandler(e, subjectId) {
        Papa.parse(e.target.files[0], {
            complete: async function(results) {
                if (results.data[0][1]) {
                    const packId = await createNewPackageForSubject(subjectId, {
                        packageName: results.data[0][1],
                        publicForEveryone: false,
                        tags: [],
                    });
                    results.data.forEach((row, index) => {
                        if (index > 2) {
                            fireContext.copyNewCardForPackage(
                                packId,
                                { word: row[0], imageUrl: row[4], example: row[2] },
                                { word: row[1], imageUrl: row[5], example: row[3] },
                                null,
                                index === results.data.length - 4
                            );
                        }
                    });
                    getPackagesBySubjectId(subjectId);
                }
            },
        });
    }
}
