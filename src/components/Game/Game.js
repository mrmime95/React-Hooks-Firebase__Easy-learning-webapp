import React from 'react';
import GameProvider from './GameProvider/GameProvider';
import { myWords } from '../../dummyData/myWords';
import CardGame from './CardGame/CardGame';
import GameSettings from './GameSettings/GameSettings';
import './Game.css';

export default function Game(props: {}) {
    return (
        <GameProvider myWords={myWords}>
            <GameSettings />
            <CardGame />
        </GameProvider>
    );
}
