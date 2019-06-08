import React, { useContext, useState } from 'react';
import { CardGameContext } from './CardGameProvider/CardGameProvider';
import FlipCard from '../../shared/FlipCard/FlipCard';
import { Link } from 'react-router-dom';

import './CardGame.scss';

export default function CardGame(props: {}) {
    const context = useContext(CardGameContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const [inverse, setInverse] = useState(false);
    return (
        <div className="card-game">
            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    {context.randomCards.length ? (
                        activeIndex < context.randomCards.length ? (
                            context.randomCards.map((card, index) => {
                                return (
                                    <div
                                        className={`carousel-item card-container ${index === activeIndex && 'active'}`}
                                        key={`flipcard${card.id}`}
                                    >
                                        <p>
                                            {index + 1} out of {context.randomCards.length}
                                        </p>
                                        <FlipCard
                                            workWithFocus
                                            card={card}
                                            stars={inverse}
                                            onClick={() => setInverse(!inverse)}
                                            interactiveStars
                                            onClickStars={e => {
                                                context.changeKwnowledgeOfCard(card.id, e.rating);
                                                next();
                                            }}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="finished-card-game">
                                <p>Over</p>
                                <button className="btn btn-primary" onClick={context.setBack}>
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
