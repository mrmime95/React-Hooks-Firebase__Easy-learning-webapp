import React, { useState, useContext } from 'react';
import FlipCard from '../../shared/FlipCard/FlipCard';
import Modal from '../../shared/Modal/Modal';
import Form from '../../shared/Form/Form';
import { SubjectsContext } from '../SubjectsProvider/SubjectsProvider';
import PicureUploader from '../../shared/PicureUploader/PicureUploader';
import FormTags from '../../shared/FormTags/FormTags';
import './CardsList.css';

export default function CardsList() {
    const [state, setState] = useState({
        newCardModalOpen: false,
        editCardModalOpen: false,
    });
    const context = useContext(SubjectsContext);
    const { cardsNumber, correctsNumber, incorrectsNumber, publicForEveryone, tags } = context.packageInformations;
    console.log(context.packageInformations);
    return (
        <div className="cards-list">
            {context.selectedPackageId !== '' && (
                <React.Fragment>
                    <div className="package-ingormations">
                        {publicForEveryone && (
                            <p className="public-for-everyone">
                                <i className="fab fa-creative-commons-share" />
                            </p>
                        )}
                        <p className="cards-number">cards number: {cardsNumber}</p>
                        <p className="correction">
                            correct: {+((correctsNumber * 100) / cardsNumber || 0).toFixed(2)}%
                        </p>
                        <p className="incorrection">
                            incorrect: {+((incorrectsNumber * 100) / cardsNumber || 0).toFixed(2)}%
                        </p>
                    </div>

                    <div className="package-tags">
                        <FormTags
                            name="tags"
                            tags={tags.map(tag => {
                                return { id: tag, text: tag };
                            })}
                            handleChange={() => {}}
                            readOnly
                        />
                    </div>

                    <button
                        className="new-card btn btn-success"
                        onClick={() => setState({ ...state, newCardModalOpen: true })}
                    >
                        <i className="fas fa-plus" />
                    </button>
                    <NewCardModal
                        isOpen={state.newCardModalOpen}
                        closeModal={closeModal}
                        className="big-modal"
                        packageId={context.selectedPackageId}
                    />
                    {!context.loading ? (
                        context.cardsOfPackage[context.selectedPackageId].map((card, index) => {
                            return (
                                <React.Fragment key={`Flipcard${index}`}>
                                    <FlipCard
                                        workWithHover
                                        packageId={context.selectedPackageId}
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

function NewCardModal(props: { packageId: string, closeModal: () => void, isOpen: boolean, className: string }) {
    const context = useContext(SubjectsContext);
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
                    context.createNewCardForPackage(props.packageId, values.front, values.back);
                    props.closeModal();
                }}
            >
                {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
                    console.log(values);
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
                                            label="Add front picture"
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
                                            placeholder="Upload a picture"
                                            label="Add back picture"
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
