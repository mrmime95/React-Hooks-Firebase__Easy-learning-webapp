import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const SubjectsContext = React.createContext();
export const SubjectsConsumer = SubjectsContext.Consumer;

export default function SubjectsProvider(props) {
    const [state, setState] = useState({
        subjects: null,
        packages: {},
    });
    const fireContext = useContext(FirebaseContext);
    useEffect(() => {
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
    }, []);
    return (
        <SubjectsContext.Provider
            value={{
                ...state,
                createNewSubject,
                createNewPackageForSubject,
                getPackagesBySubjectId,
            }}
        >
            {props.children}
        </SubjectsContext.Provider>
    );
    function createNewSubject(subject: string) {
        return fireContext.createNewSubject(subject);
    }
    function createNewPackageForSubject(sibjectId: string, values: { packageName: string, public: boolean }) {
        return fireContext.createNewPackage(sibjectId, values);
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
}
