import React, { useContext } from 'react';
import AvatarCircle from '../AvatarCircle/AvatarCircle';
import Octicon, { Alert, Check, X, Package } from '@githubprimer/octicons-react';
import ReactTooltip from 'react-tooltip';
import FlipCard from '../FlipCard/FlipCard';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import { debounce } from '../../../utils';
import Form from '../../shared/Form/Form';
import Checkbox from '../../shared/Checkbox/Checkbox';
import AutoSubmit from '../../shared/AutoSubmit/AutoSubmit';

import './NewSharedPackage.css';

export default function NewSharedPackage(props: {
    user: { fullName: string, link: string, profilePicture?: string },
    package: {
        title: string,
        words: [
            {
                front: { example: string, image: string, imageUrl: string, word: string },
                back: { example: string, image: string, imageUrl: string, word: string },
                correct?: boolean,
                cardId: string,
            },
        ],
        approved: boolean,
    },
}) {
    const { user, db } = useContext(FirebaseContext);

    return (
        <div className="new-shared-package">
            <AvatarCircle
                fullName={props.user.fullName}
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
                        const submit: (data: SearchData<Filters>) => void = debounce(data => {
                            if (word.cardId) {
                                changeCorrectOfCard(word.cardId, data.correct);
                            }
                        }, 300);
                        return (
                            <li key={`li${word.cardId}`} className="line" data-for={`li${word.cardId}`} data-tip>
                                <p className="word">{`${word.front.word}-${word.back.word}`}</p>
                                {user.role === 'admin' || user.role === 'aproover' ? (
                                    <Form
                                        initialValues={{
                                            correct: word.correct ? word.correct : 'unknow',
                                        }}
                                    >
                                        {(
                                            {
                                                handleChange,
                                                handleBlur,
                                                values,
                                                errors,
                                                touched,
                                            }: FormFieldProps<SearchData<any>>,
                                            FormRow
                                        ) => {
                                            return (
                                                <div>
                                                    <Checkbox
                                                        handleChange={() => {
                                                            handleChange({
                                                                target: {
                                                                    name: 'correct',
                                                                    value: 'correct',
                                                                },
                                                            });
                                                        }}
                                                        name="correct"
                                                        checked={values.correct === 'correct'}
                                                        label="correct"
                                                    />
                                                    <Checkbox
                                                        handleChange={() => {
                                                            handleChange({
                                                                target: {
                                                                    name: 'correct',
                                                                    value: 'unknow',
                                                                },
                                                            });
                                                        }}
                                                        name="correct"
                                                        checked={values.correct === 'unknow'}
                                                        label="unknown"
                                                    />
                                                    <Checkbox
                                                        handleChange={() => {
                                                            handleChange({
                                                                target: {
                                                                    name: 'correct',
                                                                    value: 'incorrect',
                                                                },
                                                            });
                                                        }}
                                                        name="correct"
                                                        checked={values.correct === 'incorrect'}
                                                        label="incorrect"
                                                    />
                                                    <AutoSubmit data={values} onSubmit={submit} />
                                                </div>
                                            );
                                        }}
                                    </Form>
                                ) : (
                                    <div>
                                        {word.correct === 'incorrect' ? (
                                            <Octicon className="correct incorrect" icon={X} />
                                        ) : word.correct === 'correct' ? (
                                            <Octicon className="correct" icon={Check} />
                                        ) : (
                                            <Octicon className="correct unknown" icon={Alert} />
                                        )}
                                    </div>
                                )}
                                <ReactTooltip id={`li${word.cardId}`} place="right" type="success" effect="solid">
                                    <div className="preview">
                                        <FlipCard card={{ front: word.front, back: word.back }} />
                                        <FlipCard card={{ front: word.front, back: word.back }} inverse />
                                    </div>
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

    async function changeCorrectOfCard(cardId: string, value: number) {
        const currentCardRef = db.doc(`cards/${cardId}`);
        const batch = db.batch();
        console.log(value);
        batch.update(currentCardRef, {
            correct: value,
        });
        batch.commit();
    }
}
