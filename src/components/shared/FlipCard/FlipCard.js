import React from 'react';
import './FlipCard.css';

export default function FlipCard(props: {
    showBack?: boolean,
    workWithHover?: boolean,
    inverse?: boolean,
    front: React$node,
    back: React$node,
}) {
    console.log('====================================');
    console.log(props.front.imagePath);
    console.log('====================================');
    return (
        <div className={`flip-card ${props.workWithHover && 'work-with-hover'}`}>
            <div className={`content ${props.showBack && 'show-back'}`}>
                <div className={props.inverse ? 'back' : 'front'}>
                    <h1 className="title">{props.front.word}</h1>
                    {props.front.imagePath && (
                        <img className="image" src={props.front.imagePath} alt={props.front.word} />
                    )}
                    <p className="example">{props.front.example}</p>
                </div>
                <div className={props.inverse ? 'front' : 'back'}>
                    <h1>{props.back.word}</h1>
                    {props.back.image && <img src={props.back.image} alt={props.back.word} />}
                    <p>{props.back.example}</p>
                </div>
            </div>
        </div>
    );
}
