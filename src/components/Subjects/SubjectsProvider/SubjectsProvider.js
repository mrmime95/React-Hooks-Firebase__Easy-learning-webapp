import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
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
        values: { packageName: string, publicForFriends: boolean, publicForEveryone: boolean }
    ) {
        const batch = fireContext.db.batch();
        const packagesRef = fireContext.db.collection('packages').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);

        batch.set(packagesRef, {
            ...values,
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
        values: { packageName: string, publicForFriends: boolean, publicForEveryone: boolean }
    ) {
        fireContext.db
            .doc(`packages/${packId}`)
            .update({
                ...values,
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
}
