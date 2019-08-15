import React from 'react';
import GameProvider from './GameProvider/GameProvider';
import CardGame from './CardGame/CardGame';
import GameSettings from './GameSettings/GameSettings';
import './Game.css';

export default function Game(props: {}) {
    return (
        <GameProvider>
            <div className="game">
                <GameSettings />
                <CardGame />
            </div>
        </GameProvider>
    );
}
