import React, { useState, useContext } from 'react';
import './FlipCard.css';
import Modal from '../Modal/Modal';
import Form from '../../shared/Form/Form';
import PicureUploader from '../../shared/PicureUploader/PicureUploader';
import { SubjectsContext } from '../../Subjects/SubjectsProvider/SubjectsProvider';
import Octicon, { Alert, Check, X } from '@githubprimer/octicons-react';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

export default function FlipCard(props: {
    showBack?: boolean,
    workWithHover?: boolean,
    workWithFocus?: boolean,
    inverse?: boolean,
    editable: boolean,
    packageId?: string,
    card: {
        id?: string,
        back: {
            example: string,
            image: string,
            imageUrl: string,
            word: string,
        },
        front: {
            example: string,
            image: string,
            imageUrl: string,
            word: string,
        },
        knowledge: number,
    },
    onClick: () => void,
    onClickStars: () => void,
    stars: boolean,
    interactiveStars: boolean,
}) {
    const [state, setState] = useState({ editCardModalOpen: false, clicked: false });
    const context = useContext(SubjectsContext);
    return (
        <div
            className={`flip-card ${props.workWithHover && 'work-with-hover'} ${props.workWithFocus &&
                state.clicked &&
                'work-with-focus'}`}
        >
            <div
                className={`flip-card-content ${props.showBack && 'show-back'}`}
                onClick={() => {
                    setState({ ...state, clicked: !state.clicked });
                    if (props.onClick) {
                        props.onClick();
                    }
                }}
            >
                <div className={props.inverse ? 'back' : 'front'}>
                    {props.card.front.imageUrl && (
                        <div className="image-container">
                            <img className="image" src={props.card.front.imageUrl} alt={props.card.front.word} />
                        </div>
                    )}
                    <div className="text-container">
                        <h3 className="title">{props.card.front.word}</h3>
                        <p className="example">{props.card.front.example}</p>
                    </div>
                </div>
                <div className={props.inverse ? 'front' : 'back'}>
                    {props.card.back.imageUrl && (
                        <div className="image-container">
                            <img className="image" src={props.card.back.imageUrl} alt={props.card.back.word} />
                        </div>
                    )}
                    <div className="text-container">
                        <h3 className="title">{props.card.back.word}</h3>
                        <p className="example">{props.card.back.example}</p>
                    </div>
                </div>
            </div>
            {props.editable && (
                <div className="card-options">
                    <button className="btn btn-dark" onClick={() => setState({ ...state, editCardModalOpen: true })}>
                        <i className="far fa-edit" />
                    </button>
                    <button
                        className="btn btn-dark"
                        onClick={() => {
                            context.deleteCardById(props.card.id, props.packageId);
                        }}
                    >
                        <i className="far fa-trash-alt" />
                    </button>
                    <button className="btn btn-dark" disabled>
                        {props.card.correct === 'incorrect' ? (
                            <Octicon className="correct incorrect" icon={X} />
                        ) : props.card.correct === 'correct' ? (
                            <Octicon className="correct" icon={Check} />
                        ) : (
                            <Octicon className="correct unknown" icon={Alert} />
                        )}
                    </button>
                    <EditCardModal
                        isOpen={state.editCardModalOpen}
                        closeModal={() => setState({ ...state, editCardModalOpen: false })}
                        className="big-modal"
                        packageId={props.packageId}
                        card={props.card}
                    />
                </div>
            )}
            {props.stars && (
                <div className="knowledge">
                    <Rater
                        total={5}
                        rating={props.card.knowledge}
                        interactive={props.interactiveStars ? true : false}
                        onRate={props.onClickStars}
                    />
                </div>
            )}
        </div>
    );
}
function EditCardModal(props: {
    closeModal: () => void,
    isOpen: boolean,
    className: string,
    packageId: string,
    card: {
        id: string,
        back: {
            example: string,
            image: string,
            word: string,
        },
        front: {
            example: string,
            image: string,
            word: string,
        },
    },
}) {
    const context = useContext(SubjectsContext);
    return (
        <Modal isOpen={props.isOpen} handleClickOutside={props.closeModal} className={props.className}>
            <div className="modal-title">Edit card</div>
            <Form
                initialValues={{
                    front: {
                        image: null,
                        imageUrl: props.card.front.imageUrl,
                        word: props.card.front.word,
                        example: props.card.front.example,
                    },
                    back: {
                        image: null,
                        imageUrl: props.card.back.imageUrl,
                        word: props.card.back.word,
                        example: props.card.back.example,
                    },
                }}
                onSubmit={values => {
                    console.log('Edit cardSubmiting');
                    context.updateCard(props.packageId, props.card.id, values.front, values.back);
                    props.closeModal();
                }}
            >
                {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
                    return (
                        <div className="modal-form">
                            <h5>Front side</h5>
                            <div className="adder front">
                                <div className="inputs">
                                    <div className="adder-image">
                                        <PicureUploader
                                            nameUrl="front.imageUrl"
                                            nameImage="front.image"
                                            imageUrl={values.front.imageUrl}
                                            handleChange={value => {
                                                handleChange(value);
                                                if (typeof value.target.value !== 'string') {
                                                    let reader = new FileReader();

                                                    reader.onloadend = () => {
                                                        handleChange(
                                                            (({
                                                                target: {
                                                                    name: 'front.imageUrl',
                                                                    value: reader.result,
                                                                },
                                                            }: any): SyntheticInputEvent<any>)
                                                        );
                                                    };

                                                    reader.readAsDataURL(value.target.value);
                                                } else {
                                                    handleChange(
                                                        (({
                                                            target: {
                                                                name: 'front.image',
                                                                value: null,
                                                            },
                                                        }: any): SyntheticInputEvent<any>)
                                                    );
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            type="file"
                                            placeholder="Upload a picture"
                                            label="Profile picture"
                                        />
                                    </div>
                                    <div className="form-group word">
                                        <input
                                            name="front.word"
                                            value={values.front.word}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            className="form-control"
                                            placeholder="Front word/expression"
                                        />
                                    </div>
                                    <div className="form-group example">
                                        <input
                                            name="front.example"
                                            value={values.front.example}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            className="form-control"
                                            placeholder="Front exapmle"
                                        />
                                    </div>
                                </div>
                                <div className="preview">
                                    <FlipCard card={values} />
                                </div>
                            </div>
                            <hr />
                            <h5>Back side</h5>
                            <div className="adder back">
                                <div className="inputs">
                                    <div className="adder-image">
                                        <PicureUploader
                                            nameUrl="back.imageUrl"
                                            nameImage="back.image"
                                            imageUrl={values.back.imageUrl}
                                            handleChange={value => {
                                                handleChange(value);
                                                if (typeof value.target.value !== 'string') {
                                                    let reader = new FileReader();

                                                    reader.onloadend = () => {
                                                        handleChange(
                                                            (({
                                                                target: {
                                                                    name: 'back.imageUrl',
                                                                    value: reader.result,
                                                                },
                                                            }: any): SyntheticInputEvent<any>)
                                                        );
                                                    };

                                                    reader.readAsDataURL(value.target.value);
                                                } else {
                                                    handleChange(
                                                        (({
                                                            target: {
                                                                name: 'back.image',
                                                                value: null,
                                                            },
                                                        }: any): SyntheticInputEvent<any>)
                                                    );
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            type="file"
                                            className="form-control"
                                            placeholder="Upload a picture"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            name="back.word"
                                            value={values.back.word}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            className="form-control"
                                            placeholder="Back word/expression"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            name="back.example"
                                            value={values.back.example}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            className="form-control"
                                            placeholder="Back example"
                                        />
                                    </div>
                                </div>
                                <div className="preview">
                                    <FlipCard card={values} inverse />
                                </div>
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
    );
}
