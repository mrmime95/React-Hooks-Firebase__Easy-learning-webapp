import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const GameContext = React.createContext();

export default function GameProvider(props: { children: React$Node, myWords: {} }) {
    const [state, setState] = useState({
        selectedPackages: [],
        subjects: null,
        packages: [],
        gameStarted: false,
    });
    const fireContext = useContext(FirebaseContext);
    useEffect(getSubjectsByCurrentUser, []);

    return (
        <GameContext.Provider value={{ ...state, onSubmit, changeGameStarted }}>{props.children}</GameContext.Provider>
    );

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
    function getPackagesBySubjectId(subjectId: string) {
        fireContext
            .getPackagesBySubjectId(subjectId)
            .then(querySnapshot => {
                const packages = state.packages;
                querySnapshot.forEach(doc => {
                    packages.push({
                        id: doc.id,
                        title: doc.data().packageName,
                    });
                });
                console.log('getPackagesBySubjectId', packages);
                setState({ ...state, packages });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }

    function onSubmit(data) {
        if (!state.gameStarted) {
            console.log(data);
            /* data.subjects.forEach(subject => {
                getPackagesBySubjectId(subject.value);
            }); */
        }
    }
    function changeGameStarted() {
        setState({ ...state, gameStarted: !state.gameStarted });
    }
}
