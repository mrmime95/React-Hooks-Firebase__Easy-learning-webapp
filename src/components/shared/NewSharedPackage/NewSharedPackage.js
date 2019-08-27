import React, { useContext, useState } from 'react';
import AvatarCircle from '../AvatarCircle/AvatarCircle';
import Octicon, { Alert, Check, X, Package } from '@githubprimer/octicons-react';
import ReactTooltip from 'react-tooltip';
import FlipCard from '../FlipCard/FlipCard';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import { debounce } from '../../../utils';
import Form from '../../shared/Form/Form';
import Checkbox from '../../shared/Checkbox/Checkbox';
import AutoSubmit from '../../shared/AutoSubmit/AutoSubmit';
import FormTags from '../../shared/FormTags/FormTags';
import Modal from '../../shared/Modal/Modal';
import SelectInput from '../../shared/SelectInput/SelectInput';
import NewSharedPackageProvider, { NewSharedPackageContext } from './NewSharedPackageProvider/NewSharedPackageProvider';
import { Link } from 'react-router-dom';

import './NewSharedPackage.css';

export default function NewSharedPackage(props: {
    user: { fullName: string, link: string, profilePicture?: string },
    package: {
        cardsNumber: number,
        correctNumber: number,
        createdBy: { fullName: string, createdAt: string, id: string },
        incorrectsNumber: number,
        packageName: string,
        publicForEveryone: boolean,
        publicForFriends: boolean,
        subjectId: string,
        tags: [string],
        words: [
            {
                front: { example: string, image: string, imageUrl: string, word: string },
                back: { example: string, image: string, imageUrl: string, word: string },
                correct?: boolean,
                cardId: string,
            }
        ],
    },
}) {
    return (
        <NewSharedPackageProvider>
            <NewSharedPackageContent {...props} />
        </NewSharedPackageProvider>
    );
}

function NewSharedPackageContent(props) {
    const { user, db, increment, decrement } = useContext(FirebaseContext);
    const [savingModalOpen, setSavingModalOpen] = useState(false);
    const context = useContext(NewSharedPackageContext);
    return (
        <div className="new-shared-package">
            <Link to={props.user.link}>
                <AvatarCircle
                    fullName={props.user.fullName}
                    profilePicture={props.user.profilePicture && props.user.profilePicture}
                />
            </Link>
            <div className="content">
                <h3 className="name">{props.user.fullName}</h3>
                <div className="tags">
                    <FormTags
                        name="tags"
                        tags={props.package.tags.map(tag => {
                            return { id: tag, text: tag };
                        })}
                        handleChange={() => {}}
                        readOnly
                    />
                </div>
                <div className="package-ingormations">
                    {props.package.publicForEveryone && (
                        <p className="public-for-everyone">
                            <i className="fab fa-creative-commons-share" />
                        </p>
                    )}
                    <p className="cards-number">cards number: {props.package.cardsNumber}</p>
                    <p className="correction">
                        correct: {+((props.package.correctsNumber * 100) / props.package.cardsNumber || 0).toFixed(2)}%
                    </p>
                    <p className="incorrection">
                        incorrect:{' '}
                        {+((props.package.incorrectsNumber * 100) / props.package.cardsNumber || 0).toFixed(2)}%
                    </p>
                </div>
                <div className="package-title">
                    <Octicon className="package" icon={Package} />
                    <h2>{props.package.packageName}</h2>
                </div>
                <ul className="words">
                    {props.package.words.map((word, index) => {
                        const submit: (data: SearchData<Filters>) => void = debounce(data => {
                            console.log(props.package);
                            if (word.cardId) {
                                changeCorrectOfCard(word.cardId, data.correct, props.package.id);
                            }
                        }, 300);
                        return (
                            <li key={`li${word.cardId}`} className="line" data-for={`li${word.cardId}`} data-tip>
                                <p className="word">{`${word.front.word}-${word.back.word}`}</p>
                                {user.role === 'admin' ||
                                (user.role === 'approver' && compareArrays(user.approverAt, props.package.tags)) ? (
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
                                                <div className="checkbox-form-correct">
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
                    <button type="button" className="btn btn-outline-success" onClick={() => setSavingModalOpen(true)}>
                        Copy
                    </button>
                </div>
            </div>
            <Modal
                isOpen={savingModalOpen}
                handleClickOutside={() => {
                    console.log('outside cLick');
                    setSavingModalOpen(false);
                }}
                className="one-line-modal"
            >
                <div className="modal-title">Save to me into subject:</div>
                <Form
                    initialValues={{
                        subjectName: null,
                        packageName: props.package.packageName,
                    }}
                    onSubmit={values => {
                        context.saveToUser(values, props.package);
                        setSavingModalOpen(false);
                    }}
                >
                    {(
                        { handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched },
                        FormRow
                    ) => {
                        return (
                            <div className="modal-form">
                                <div className="form-group select-input">
                                    <SelectInput
                                        value={values.subjectNameSelect}
                                        name="subjectName"
                                        onChange={value => {
                                            if (value.label) {
                                                handleChange({
                                                    target: {
                                                        name: 'subjectName',
                                                        value:
                                                            value.value === value.label
                                                                ? { id: null, value: value.value }
                                                                : { id: value.value, value: value.label },
                                                    },
                                                });
                                            }
                                        }}
                                        options={
                                            context.subjects &&
                                            context.subjects.map(subject => {
                                                return { value: subject.id, label: subject.title };
                                            })
                                        }
                                        placeholder="Select/Add target subject"
                                    />
                                </div>
                                <div className="form-group select-input">
                                    <label className="form-check-label" htmlFor="packageName">
                                        Copy package as:
                                    </label>
                                    <input
                                        id="packageName"
                                        type="text"
                                        className="form-control"
                                        placeholder="Package name"
                                        name="packageName"
                                        value={values.packageName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={props.closeModal}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                </Form>
            </Modal>
        </div>
    );

    async function changeCorrectOfCard(cardId: string, value: number, packageId: string) {
        const currentCardRef = db.doc(`cards/${cardId}`);
        const batch = db.batch();
        batch.update(currentCardRef, {
            correct: value,
        });

        console.log(packageId);

        const currentPackageRef = db.doc(`packages/${packageId}`);
        const currentCard = await currentCardRef.get();
        if (currentCard.data().correct === 'correct') {
            batch.update(currentPackageRef, {
                correctsNumber: decrement,
            });
        }
        if (currentCard.data().correct === 'incorrect') {
            batch.update(currentPackageRef, {
                incorrectsNumber: decrement,
            });
        }
        if (value === 'correct') {
            batch.update(currentPackageRef, {
                correctsNumber: increment,
            });
        }
        if (value === 'incorrect') {
            batch.update(currentPackageRef, {
                incorrectsNumber: increment,
            });
        }

        batch.commit();
    }

    function compareArrays(usersTags: [string], packagesTags: [string]) {
        if (usersTags.length && packagesTags.length) {
            return usersTags.filter(x => packagesTags.includes(x)).length !== 0;
        }
        return true;
    }
}
