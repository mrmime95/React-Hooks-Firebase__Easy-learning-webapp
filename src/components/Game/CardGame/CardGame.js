import React, { useContext, useState } from 'react';
import { GameContext } from '../GameProvider/GameProvider';
import FlipCard from '../../shared/FlipCard/FlipCard';
import { Link } from 'react-router-dom';
import Stepper from 'react-stepper-horizontal';

import './CardGame.scss';

export default function CardGame(props: {}) {
    const { randomCards, changeKwnowledgeOfCard, setBack, gameStarted, inverseGame, cards, replayWith } = useContext(
        GameContext
    );
    const [activeIndex, setActiveIndex] = useState(0);
    const [inverse, setInverse] = useState(inverseGame);
    const overAGame = activeIndex >= randomCards.length;

    const [newRate, setNewRate] = useState([]);
    return (
        <div className="card-game">
            {gameStarted ? (
                <div className="game-container">
                    {overAGame ? (
                        <div className="finished-card-game">
                            <div className="stats">
                                <h4 className="stats-name">Stats:</h4>
                                <div className="stats-cards-list">
                                    {randomCards.map((randomCard, index) => {
                                        return (
                                            <p key={'randomCard' + index + randomCard.id} className="stats-card">
                                                {`Card ${index + 1}:  ${'★'.repeat(
                                                    randomCard.knowledge
                                                )} >>> ${'★'.repeat(newRate[index])}`}
                                            </p>
                                        );
                                    })}
                                </div>
                                <div className="summary">
                                    <p>
                                        Worsen:{' '}
                                        {randomCards
                                            .map((randomCard, index) => {
                                                if (
                                                    cards.find(card => card.id === randomCard.id).knowledge >
                                                    newRate[index]
                                                ) {
                                                    return 1;
                                                }
                                                return 0;
                                            })
                                            .reduce((a, b) => a + b, 0)}
                                    </p>
                                    <p>
                                        No changes:{' '}
                                        {randomCards
                                            .map((randomCard, index) => {
                                                if (
                                                    cards.find(card => card.id === randomCard.id).knowledge ===
                                                    newRate[index]
                                                ) {
                                                    return 1;
                                                }
                                                return 0;
                                            })
                                            .reduce((a, b) => a + b, 0)}
                                    </p>
                                    <p>
                                        Better:{' '}
                                        {randomCards
                                            .map((randomCard, index) => {
                                                if (
                                                    cards.find(card => card.id === randomCard.id).knowledge <
                                                    newRate[index]
                                                ) {
                                                    return 1;
                                                }
                                                return 0;
                                            })
                                            .reduce((a, b) => a + b, 0)}
                                    </p>
                                </div>
                            </div>
                            <div className="next-stepp">
                                <div className="dropdown">
                                    <button
                                        className="btn btn-primary dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuLink"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        onClick={e => {
                                            e.preventDefault();
                                        }}
                                    >
                                        Replay if it's under
                                    </button>

                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                        {newRate.find(r => r < 2) && (
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => {
                                                    replay(2);
                                                }}
                                            >
                                                ★★
                                            </button>
                                        )}
                                        {newRate.find(r => r < 3) && (
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => {
                                                    replay(3);
                                                }}
                                            >
                                                ★★★
                                            </button>
                                        )}
                                        {newRate.find(r => r < 4) && (
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => {
                                                    replay(4);
                                                }}
                                            >
                                                ★★★★
                                            </button>
                                        )}
                                        {newRate.find(r => r < 5) && (
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => {
                                                    replay(5);
                                                }}
                                            >
                                                ★★★★★
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => {
                                                replay();
                                            }}
                                        >
                                            Replay all
                                        </button>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={setBack}>
                                    Restart game with new setup
                                </button>
                                <Link to="/dashboard" className="btn btn-primary">
                                    Back to dashboard
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="informations">
                                <Stepper
                                    steps={randomCards.map((card, index) => ({ title: `Card ${index + 1}` }))}
                                    activeStep={activeIndex}
                                />
                            </div>
                            <div className="cards-list">
                                {randomCards && randomCards.length ? (
                                    randomCards.map((card, index) => {
                                        return (
                                            <div
                                                className={`card-container ${index === activeIndex && 'active'} `}
                                                style={{
                                                    transform: `translateX(${
                                                        activeIndex === index
                                                            ? index * -100
                                                            : activeIndex > index
                                                            ? (index + 1) * -100
                                                            : 0
                                                    }%)`,
                                                }}
                                                key={`flipcard${card.id}`}
                                            >
                                                <FlipCard
                                                    workWithFocus
                                                    card={card}
                                                    stars={inverse}
                                                    onClick={() => setInverse(!inverse)}
                                                    interactiveStars
                                                    onClickStars={e => {
                                                        changeKwnowledgeOfCard(card.id, e.rating);
                                                        setNewRate([...newRate, e.rating]);
                                                        next();
                                                    }}
                                                    inverse={inverseGame}
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>

                            <button type="button" className="dropdown-item" onClick={setBack}>
                                Exit
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div>Please select Options and click on Play button</div>
            )}
        </div>
    );

    function next() {
        setInverse(!inverse);
        setActiveIndex(activeIndex + 1);
    }

    function replay(w: number = -1) {
        replayWith(w, newRate);
        setNewRate([]);
        setActiveIndex(0);
    }
}
