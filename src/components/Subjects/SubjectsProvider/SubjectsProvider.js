import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const SubjectsContext = React.createContext();
export const SubjectsConsumer = SubjectsContext.Consumer;

export default function SubjectsProvider(props) {
    const [state, setState] = useState({
        subjects: null,
        packages: {},
        selectedPackageId: '',
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
    function updateSubject(subjectId: string, values: { subject: string }) {
        fireContext.db
            .doc(`subjects/${subjectId}`)
            .update({
                subjectName: values.subject,
            })
            .then(function() {
                console.log('Document successfully updated!');
                getSubjectsByCurrentUser();
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    }
    function updatePackagesAtSubject(
        subjectId: string,
        packId: string,
        values: { packageName: string, public: boolean }
    ) {
        fireContext.db
            .doc(`packages/${packId}`)
            .update({
                packageName: values.packageName,
                public: values.public,
            })
            .then(function() {
                console.log('Document successfully updated!');
                getPackagesBySubjectId(subjectId);
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    }
    function createNewPackageForSubject(sibjectId: string, values: { packageName: string, public: boolean }) {
        const batch = fireContext.db.batch();
        const packagesRef = fireContext.db.collection('packages').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
        batch.set(packagesRef, {
            packageName: values.packageName,
            public: values.public,
            subjectId: sibjectId,
        });
        batch.update(userRef, { packagesNumber: fireContext.increment });
        batch.commit();
    }

    function createNewSubject(subject: string) {
        const batch = fireContext.db.batch();
        const subjectsRef = fireContext.db.collection('subjects').doc();
        const userRef = fireContext.db.collection('users').doc(fireContext.user.id);
        batch.set(subjectsRef, {
            subjectName: subject,
            userId: fireContext.user.id,
        });
        batch.update(userRef, { subjectsNumber: fireContext.increment });
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
                        id: doc.id,
                        title: doc.data().packageName,
                        public: doc.data().public,
                    });
                });
                setState({ ...state, packages });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }

    function getSubjectsByCurrentUser() {
        fireContext
            .getSubjectsByCurrentUser()
            .then(querySnapshot => {
                const subjects = [];
                querySnapshot.forEach(doc => {
                    subjects.push({
                        id: doc.id,
                        title: doc.data().subjectName,
                    });
                });
                setState({ ...state, subjects });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }

    /* function deleteSubject(subjectId: string) {
        fireContext.db
            .doc(`subjects/${subjectId}`)
            .update({
                subjectName: values.subject,
            })
            .then(function() {
                console.log('Document successfully updated!');
                getSubjectsByCurrentUser();
            })
            .catch(function(error) {
                console.error('Error updating document: ', error);
            });
    } */
}
