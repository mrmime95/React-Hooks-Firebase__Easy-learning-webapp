import React, { useState } from 'react';

export const GameContext = React.createContext();

export default function GameProvider(props: { children: React$Node, myWords: {} }) {
    const [state, setState] = useState({
        selectedPackages: [],
        subjects: props.myWords.map(value => value.title),
        packages: [],
        gameStarted: false,
    });

    return (
        <GameContext.Provider value={{ ...state, onSubmit, changeGameStarted }}>{props.children}</GameContext.Provider>
    );

    function onSubmit(data) {
        if (!state.gameStarted) {
            console.log(data);
            const packages = props.myWords
                .filter(subject => data.subjects.map(selectedSubject => selectedSubject.value).includes(subject.title))
                .map(subject => subject.packages.map(pack => pack.title))
                .flat(1);
            setState({ ...state, packages });
        }
    }
    function changeGameStarted() {
        setState({ ...state, gameStarted: !state.gameStarted });
    }
}
