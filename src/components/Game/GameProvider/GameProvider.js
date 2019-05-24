import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const GameContext = React.createContext();

export default function GameProvider(props: { children: React$Node }) {
    const [subjects, setSubjects] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [packages, setPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    const fireContext = useContext(FirebaseContext);
    useEffect(getSubjectsByCurrentUser, []);
    return (
        <GameContext.Provider
            value={{
                subjects,
                packages,
                gameStarted,
                getPackagesOfSubjects,
                changeGameStarted,
                getPackagesBySubjectId,
            }}
        >
            {props.children}
        </GameContext.Provider>
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
                setSubjects(subjects);
            })
            .catch(function(error) {
                alert('Error getting documents: ', error);
            });
    }

    async function getPackagesOfSubjects(localSubjects: [{ value: string, label: string }]) {
        const listOfResults = await Promise.all(
            localSubjects.map(async subject => {
                return await getPackagesBySubjectId(subject.value);
            })
        );
        const listOfPackages = [];
        listOfResults.map(value1 => value1.map(value2 => listOfPackages.push(value2)));
        setPackages(listOfPackages);
    }

    async function getPackagesBySubjectId(subjectId: string) {
        const packs = [];
        await fireContext
            .getPackagesBySubjectId(subjectId)
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    packs.push({
                        id: doc.id,
                        title: doc.data().packageName,
                    });
                });
            })
            .catch(function(error) {
                alert('Error getting documents: ', error);
            });
        return packs;
    }
    /* 
    function onSubmit(data) {
        if (!gameStarted) {
            console.log(data);
            /* data.subjects.forEach(subject => {
                getPackagesBySubjectId(subject.value);
            }); 
        }
    }*/
    function changeGameStarted() {
        setGameStarted(!gameStarted);
    }
}
