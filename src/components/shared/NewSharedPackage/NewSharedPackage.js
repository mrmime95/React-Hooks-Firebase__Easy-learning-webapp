import React from 'react';
import AvatarCircle from '../AvatarCircle/AvatarCircle';
import Octicon, { Alert, Check, X, Package } from '@githubprimer/octicons-react';
import ReactTooltip from 'react-tooltip';
import './NewSharedPackage.css';

export default function NewSharedPackage(props: {
    user: { fullName: string, link: string, profilePicture?: string },
    package: {
        title: string,
        words: [
            {
                front: { example: string, image: string, imageUrl: string, word: string },
                back: { example: string, image: string, imageUrl: string, word: string },
                correct: 'correct' | 'unknown' | 'uncorrect',
            },
        ],
        approved: boolean,
    },
}) {
    return (
        <div className="new-shared-package">
            <AvatarCircle
                fullName={props.user.fullName}
                onClick={goToProfile}
                profilePicture={props.user.profilePicture && props.user.profilePicture}
            />
            <div className="content">
                <h3 className="name">{props.user.fullName}</h3>
                <div className="package-title">
                    <Octicon className="package" icon={Package} />
                    <h2>{props.package.title}</h2>
                </div>
                <ul className="words">
                    {props.package.words.map((word, index) => {
                        return (
                            <li key={`li${index}`} className="line" data-for={`li${index}`} data-tip>
                                <p className="word">{`${word.front.word}-${word.back.word}`}</p>
                                {word.correct === 'unknown' ? (
                                    <Octicon className="correct unknown" icon={Alert} />
                                ) : word.correct === 'correct' ? (
                                    <Octicon className="correct" icon={Check} />
                                ) : (
                                    <Octicon className="correct incorrect" icon={X} />
                                )}
                                <ReactTooltip id={`li${index}`} place="right" type="success" effect="solid">
                                    <span>Show sad face</span>
                                </ReactTooltip>
                            </li>
                        );
                    })}
                </ul>
                <div className="buttons">
                    <button type="button" className="btn btn-outline-success">
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );

    function goToProfile() {
        console.log(props.user.link);
    }
}
