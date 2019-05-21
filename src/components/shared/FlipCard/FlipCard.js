import React, { useState } from 'react';
import './FlipCard.css';
import Modal from '../Modal/Modal';
import Form from '../../shared/Form/Form';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

export default function FlipCard(props: {
    showBack?: boolean,
    workWithHover?: boolean,
    inverse?: boolean,
    editable: boolean,
    packageId?: string,
    card: {
        id?: string,
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
        hardness: number,
    },
    stars: boolean,
    interactiveStars: boolean,
}) {
    const [state, setState] = useState({ editCardModalOpen: false });

    return (
        <div className={`flip-card ${props.workWithHover && 'work-with-hover'}`}>
            <div className={`content ${props.showBack && 'show-back'}`}>
                <div className={props.inverse ? 'back' : 'front'}>
                    {props.card.front.image && (
                        <div className="image-container">
                            <img className="image" src={props.card.front.image} alt={props.card.front.word} />
                        </div>
                    )}
                    <div className="text-container">
                        <h1 className="title">{props.card.front.word}</h1>
                        <p className="example">{props.card.front.example}</p>
                    </div>
                </div>
                <div className={props.inverse ? 'front' : 'back'}>
                    {props.card.back.image && (
                        <div className="image-container">
                            <img className="image" src={props.card.back.image} alt={props.card.back.word} />
                        </div>
                    )}
                    <div className="text-container">
                        <h1>{props.card.back.word}</h1>
                        <p>{props.card.back.example}</p>
                    </div>
                </div>
            </div>
            {props.editable && (
                <div className="card-options">
                    <button className="btn btn-dark" onClick={() => setState({ ...state, editCardModalOpen: true })}>
                        <i className="far fa-edit" />
                    </button>
                    <button className="btn btn-dark">
                        <i className="far fa-trash-alt" />
                    </button>
                    <button className="btn btn-dark">
                        <i className="fas fa-file-upload" />
                    </button>
                    <EditCardModal
                        isOpen={state.editCardModalOpen}
                        closeModal={() => setState({ ...state, editCardModalOpen: false })}
                        className="big-modal"
                        packageId={props.packageId}
                        card={props.card}
                        context={props.context}
                    />
                </div>
            )}
            {props.stars && (
                <div className="knowledge">
                    <Rater
                        total={5}
                        rating={props.card.knowledge}
                        interactive={props.interactiveStars ? true : false}
                    />
                </div>
            )}
        </div>
    );
}
function EditCardModal(props: {
    context: () => void,
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
    return (
        <Modal isOpen={props.isOpen} handleClickOutside={props.closeModal} className={props.className}>
            <div className="modal-title">Edit card</div>
            <Form
                initialValues={{
                    front: {
                        image: '',
                        imageUrl: props.card.front.image,
                        word: props.card.front.word,
                        example: props.card.front.example,
                    },
                    back: {
                        image: '',
                        imageUrl: props.card.back.image,
                        word: props.card.back.word,
                        example: props.card.back.example,
                    },
                }}
                onSubmit={values => {
                    console.log('Edit cardSubmiting');
                    props.context.updateCard(props.packageId, props.card.id, values.front, values.back);
                    props.closeModal();
                }}
            >
                {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
                    return (
                        <div className="modal-form">
                            <div className="adder front">
                                <div className="inputs">
                                    <div className="adder-image">
                                        <div className="form-group image">
                                            <input
                                                name="front.image"
                                                value={values.front.image}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="file"
                                                className="form-control"
                                                placeholder="Upload a picture"
                                            />
                                        </div>
                                        <div className="form-group image-url">
                                            <input
                                                name="front.imageUrl"
                                                value={values.front.imageUrl}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="form-control"
                                                type="text"
                                                placeholder="Or add an Url"
                                            />
                                        </div>
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
                            <div className="adder back">
                                <div className="inputs">
                                    <div className="adder-image">
                                        <div className="form-group">
                                            <input
                                                name="back.image"
                                                value={values.back.image}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="file"
                                                className="form-control"
                                                placeholder="Upload a picture"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                name="back.imageUrl"
                                                value={values.back.imageUrl}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                className="form-control"
                                                placeholder="Or add an Url"
                                            />
                                        </div>
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
