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
            }}
        >
            {props.children}
        </SubjectsContext.Provider>
    );
    function setSelectedPackage(packageId) {
        setState({ ...state, selectedPackageId: packageId });
        console.log('setSelectedPackage', packageId);
    }
    function createNewSubject(subject: string) {
        return fireContext.db
            .collection('subjects')
            .add({
                subjectName: subject,
                userId: fireContext.user.id,
            })
            .then(() => {
                console.log('subject saved');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
    }
    function createNewPackageForSubject(sibjectId: string, values: { packageName: string, public: boolean }) {
        return fireContext.db
            .collection('packages')
            .add({
                packageName: values.packageName,
                public: values.public,
                subjectId: sibjectId,
            })
            .then(() => {
                console.log('package saved');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
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
}
