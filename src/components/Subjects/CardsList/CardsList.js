import React, { useState, useContext } from 'react';
import FlipCard from '../../shared/FlipCard/FlipCard';
import Modal from '../../shared/Modal/Modal';
import Form from '../../shared/Form/Form';
import { SubjectsContext } from '../SubjectsProvider/SubjectsProvider';
import { CardListContext } from '../CardListProvider/CardListProvider';
import './CardsList.css';

export default function CardsList() {
    const [state, setState] = useState({
        newCardModalOpen: false,
    });
    const subjectContext = useContext(SubjectsContext);
    const cardListContext = useContext(CardListContext);
    return (
        <div className="cards-list">
            {subjectContext.selectedPackageId !== '' && (
                <React.Fragment>
                    <button
                        className="new-card btn btn-success"
                        onClick={() => setState({ ...state, newCardModalOpen: true })}
                    >
                        <i className="fas fa-plus" />
                    </button>
                    <NewCardModal
                        context={cardListContext}
                        isOpen={state.newCardModalOpen}
                        closeModal={closeModal}
                        className="big-modal"
                        packageId={subjectContext.selectedPackageId}
                    />
                    {cardListContext.cardsOfPackage[subjectContext.selectedPackageId] ? (
                        cardListContext.cardsOfPackage[subjectContext.selectedPackageId].map((card, index) => {
                            return (
                                <FlipCard workWithHover front={card.front} back={card.back} key={`Flipcard${index}`} />
                            );
                        })
                    ) : (
                        <div>Loading...</div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
    function closeModal() {
        setState({ ...state, newCardModalOpen: false });
    }
}

function NewCardModal(props: {
    packageId: string,
    context: () => void,
    closeModal: () => void,
    isOpen: boolean,
    className: string,
}) {
    return (
        <Modal isOpen={props.isOpen} handleClickOutside={props.closeModal} className={props.className}>
            <div className="modal-title">New card</div>
            <Form
                initialValues={{
                    front: {
                        image: '',
                        imageUrl: '',
                        word: '',
                        example: '',
                    },
                    back: {
                        image: '',
                        imageUrl: '',
                        word: '',
                        example: '',
                    },
                }}
                onSubmit={values => {
                    console.log('New cardSubmiting');
                    props.context.createNewCardForPackage(props.packageId, values.front, values.back);
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
                                    <FlipCard front={values.front} back={values.front} />
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
                                    <FlipCard front={values.back} back={values.back} />
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
