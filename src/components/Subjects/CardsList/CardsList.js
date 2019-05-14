import React, { useState } from 'react';
import FlipCard from '../../shared/FlipCard/FlipCard';
import Modal from '../../shared/Modal/Modal';
import Form from '../../shared/Form/Form';
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

export default function CardsList(props: { match: RouterMatch, location: RouterLocation }) {
    const [state, setState] = useState({
        newCardModalOpen: false,
    });
    return (
        <div className="cards-list">
            {props.match.params.id && (
                <React.Fragment>
                    <button
                        className="new-card btn btn-success"
                        onClick={() => setState({ ...state, newCardModalOpen: true })}
                    >
                        <i className="fas fa-plus" />
                    </button>
                    <Modal isOpen={state.newCardModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                        <div className="modal-title">New subject</div>
                        <Form
                            initialValues={{
                                subject: '',
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
                                        <div className="form-group">
                                            <input
                                                name="subject"
                                                value={values.subject}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                className="form-control"
                                                placeholder="New subject"
                                            />
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
