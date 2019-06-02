import React, { useState, useContext } from 'react';
import FlipCard from '../../shared/FlipCard/FlipCard';
import Modal from '../../shared/Modal/Modal';
import Form from '../../shared/Form/Form';
import { SubjectsContext } from '../SubjectsProvider/SubjectsProvider';
import { CardListContext } from './CardListProvider/CardListProvider';
import PicureUploader from '../../shared/PicureUploader/PicureUploader';
import './CardsList.css';

export default function CardsList() {
    const [state, setState] = useState({
        newCardModalOpen: false,
        editCardModalOpen: false,
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
                                <React.Fragment key={`Flipcard${index}`}>
                                    <FlipCard
                                        workWithHover
                                        packageId={subjectContext.selectedPackageId}
                                        card={card}
                                        editable
                                        stars
                                    />
                                </React.Fragment>
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
                        image: null,
                        imageUrl: '',
                        word: '',
                        example: '',
                    },
                    back: {
                        image: null,
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
                                            className="form-control"
                                            placeholder="Upload a picture"
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
