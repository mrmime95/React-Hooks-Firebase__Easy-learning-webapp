import React, { useContext, useState } from 'react';
import { GameContext } from '../GameProvider/GameProvider';
import FlipCard from '../../shared/FlipCard/FlipCard';
import { Link } from 'react-router-dom';

import './CardGame.scss';

export default function CardGame(props: {}) {
    const { randomCards, changeKwnowledgeOfCard, setBack, gameStarted } = useContext(GameContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const [inverse, setInverse] = useState(false);
    return (
        <div className="card-game">
            {gameStarted ? (
                <div className="game-container">
                    <div className="informations">
                        {activeIndex < randomCards.length && (
                            <p className="per-card">
                                {activeIndex + 1} out of {randomCards.length}
                            </p>
                        )}
                    </div>
                    <div className="cards-list">
                        {randomCards && randomCards.length ? (
                            activeIndex < randomCards.length ? (
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
                                                    next();
                                                }}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="finished-card-game">
                                    <p>Over</p>
                                    <button className="btn btn-primary" onClick={setBack}>
                                        Replay
                                    </button>
                                    <button className="btn btn-primary" onClick={setBack}>
                                        Back to game setup
                                    </button>
                                    <Link to="/dashboard" className="btn btn-primary">
                                        Back to dashboard
                                    </Link>
                                </div>
                            )
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
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
    /*    function previous() {
        setActiveIndex(activeIndex - 1 >= 0 ? activeIndex - 1 : 0);
    } */
}
