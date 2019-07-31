import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const GameContext = React.createContext();

export default function GameProvider(props: { children: React$Node }) {
    const [subjects, setSubjects] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [packages, setPackages] = useState([]);
    const [cards, setCards] = useState([]);
    const [showingCards, setShowingCards] = useState([]);
    const [randomCards, setRandomCards] = useState([]);
    const [selectedElements, setSelectedElements] = useState({
        selectedHardnessIDs: [],
        selectedPackages: [],
        selectedSubjects: [],
    });
    const fireContext = useContext(FirebaseContext);
    useEffect(getSubjectsByCurrentUser, []);
    return (
        <GameContext.Provider
            value={{
                ...selectedElements,
                subjects,
                packages,
                cards,
                showingCards,
                gameStarted,
                randomCards,
                getPackagesOfSubjects,
                changeGameStarted,
                getPackagesBySubjectId,
                getCardsOfPackages,
                filterCardsByKnowledge,
                setToDefault,
                onSubmit,
                changeKwnowledgeOfCard,
                setBack,
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

    async function getCardsOfPackages(localPackages: [{ value: string, label: string }]) {
        const listOfResults = await Promise.all(
            localPackages.map(async pack => {
                return await getCardsByPackageId(pack.value);
            })
        );
        const listOfCards = [];
        listOfResults.map(value1 => value1.map(value2 => listOfCards.push(value2)));
        setCards(listOfCards);
        setShowingCards(listOfCards);
    }

    async function filterCardsByKnowledge(cardKnowledge: [string]) {
        if (cardKnowledge.length) {
            const listOfShowingCards = cards.filter(card => cardKnowledge.includes(String(card.knowledge)));
            setShowingCards(listOfShowingCards);
        } else {
            setShowingCards(cards);
        }
    }

    async function getCardsByPackageId(packageId: string) {
        const cards = [];
        await fireContext
            .getCardsByPackageId(packageId)
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    cards.push({
                        id: doc.id,
                        back: doc.data().back,
                        front: doc.data().front,
                        knowledge: doc.data().knowledge,
                        packageId,
                    });
                });
            })
            .catch(function(error) {
                alert('Error getting documents: ', error);
            });
        return cards;
    }

    function onSubmit(data: { hardnessIDs: Array<string>, packages: Array<string>, subjects: Array<string> }) {
        setSelectedElements({
            selectedHardnessIDs: data.hardnessIDs,
            selectedPackages: data.packages,
            selectedSubjects: data.subjects,
        });
    }
    function changeGameStarted() {
        setGameStarted(!gameStarted);
        getCardsRandomly(showingCards);
    }

    function setToDefault() {
        setGameStarted(false);
        setPackages([]);
        setCards([]);
        setShowingCards([]);
        setSelectedElements({
            selectedHardnessIDs: [],
            selectedPackages: [],
            selectedSubjects: [],
        });
    }

    function getCardsRandomly(
        cards: Array<{
            id?: string,
            back: {
                example: string,
                image: string,
                word: string,
            },
            front: {
                example: string,
                image: string,
                word: string,
            },
            knowledge: number,
            packageId: string,
        }>
    ) {
        setRandomCards(cards.sort(() => Math.random() - 0.5));
    }

    async function changeKwnowledgeOfCard(cardId: string, value: number) {
        const currentCardRef = fireContext.db.doc(`cards/${cardId}`);
        const batch = fireContext.db.batch();
        batch.update(currentCardRef, {
            knowledge: value,
        });
        batch.commit();
    }

    function setBack() {
        setToDefault();
    }
}
