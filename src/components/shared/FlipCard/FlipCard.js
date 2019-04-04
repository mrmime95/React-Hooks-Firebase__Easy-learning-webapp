import React from 'react';
import './FlipCard.css';

export default function FlipCard(props: {
    showBack?: boolean,
    workWithHover?: boolean,
    inverse?: boolean,
    front: React$node,
    back: React$node,
}) {
    return (
        <div className={`flip-card ${props.workWithHover && 'work-with-hover'}`}>
            <div className={`content ${props.showBack && 'show-back'}`}>
                <div className={props.inverse ? 'back' : 'front'}>
                    {props.front.image && (
                        <div className="image-container">
                            <img className="image" src={props.front.image} alt={props.front.word} />
                        </div>
                    )}
                    <div className="text-container">
                        <h1 className="title">{props.front.word}</h1>
                        <p className="example">{props.front.example}</p>
                    </div>
                </div>
                <div className={props.inverse ? 'front' : 'back'}>
                    {props.back.image && (
                        <div className="image-container">
                            <img className="image" src={props.back.image} alt={props.back.word} />
                        </div>
                    )}
                    <div className="text-container">
                        <h1>{props.back.word}</h1>
                        <p>{props.back.example}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
