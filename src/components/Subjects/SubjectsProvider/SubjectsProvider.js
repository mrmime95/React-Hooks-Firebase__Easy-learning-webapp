import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const SubjectsContext = React.createContext();
export const SubjectsConsumer = SubjectsContext.Consumer;

export default function SubjectsProvider(props) {
    const [state, setState] = useState({
        subjects: null,
        packages: {},
        selectedPackageId: '',
        cardsOfPackage: [],
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
        setState({ ...state, selectedPackageId: packageId, cardsOfPackage: [] });
        fireContext
            .getCardsByPackageId(packageId)
            .then(querySnapshot => {
                const cardsOfPackage = [];
                querySnapshot.forEach(doc => {
                    cardsOfPackage.push({
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
                setState({ ...state, selectedPackageId: packageId, cardsOfPackage });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }
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
