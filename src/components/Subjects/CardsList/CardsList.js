import React, { useState, useContext } from 'react';
import FlipCard from '../../shared/FlipCard/FlipCard';
import Modal from '../../shared/Modal/Modal';
import Form from '../../shared/Form/Form';
import { SubjectsContext } from '../SubjectsProvider/SubjectsProvider';
import './CardsList.css';
const packages = [
    {
        title: 'dd',
        id: 1,
        cards: [
            {
                front: {
                    word: 'bika',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'bull',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'bika',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'bull',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'bika',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'bull',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'bika',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'bull',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'bika',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'bull',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'bika',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'bull',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
        ],
    },
];

export default function CardsList() {
    const [state, setState] = useState({
        newCardModalOpen: false,
    });
    const context = useContext(SubjectsContext);
    console.log(context.cardsOfPackage);
    return (
        <div className="cards-list">
            {context.selectedPackageId !== '' && (
                <React.Fragment>
                    <button
                        className="new-card btn btn-success"
                        onClick={() => setState({ ...state, newCardModalOpen: true })}
                    >
                        <i className="fas fa-plus" />
                    </button>
                    <Modal isOpen={state.newCardModalOpen} handleClickOutside={closeModal} className="big-modal">
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
                                closeModal();
                            }}
                        >
                            {(
                                { handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched },
                                FormRow
                            ) => {
                                return (
                                    <div className="modal-form">
                                        <div className="adder front">
                                            <div className="inputs">
                                                <div className="adder-image">
                                                    <div className="form-group">
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
                                                    /
                                                    <div className="form-group">
                                                        <input
                                                            name="front.imageUrl"
                                                            value={values.front.imageUrl}
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
                                                        name="front.word"
                                                        value={values.front.word}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Front word/expression"
                                                    />
                                                </div>
                                                <div className="form-group">
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
                                            <div className="preview">LOFASZ</div>
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
                                                    /
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
                                            <div className="preview">LOFASZ</div>
                                        </div>
                                        <div className="modal-buttons">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                );
                            }}
                        </Form>
                    </Modal>
                    {packages
                        .find(pack => pack.id.toString() === '1')
                        .cards.map((card, index) => {
                            return (
                                <FlipCard workWithHover front={card.front} back={card.back} key={`Flipcard${index}`} />
                            );
                        })}
                </React.Fragment>
            )}
        </div>
    );
    function closeModal() {
        setState({ ...state, newCardModalOpen: false });
    }
}
