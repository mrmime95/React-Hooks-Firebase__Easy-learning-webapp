import React, { useState } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import ListView from './ListView/ListView';
import './Subjects.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from '../shared/Form/Form';
import Modal from '../shared/Modal/Modal';

import CardsList from './CardsList/CardsList';

const data = [
    {
        title: 'angol',
        id: 0,
        packages: [
            { title: 'konyha', id: 0 },
            { title: 'dd', id: 1 },
            { title: 'gg', id: 2 },
            { title: 'kontttttyha', id: 3 },
            { title: 'tt', id: 4 },
        ],
    },
    {
        title: 'matek',
        id: 1,
        packages: [
            { title: 'konyha', id: 0 },
            { title: 'dd', id: 1 },
            { title: 'gg', id: 2 },
            { title: 'kontttttyha', id: 3 },
            { title: 'tt', id: 4 },
        ],
    },

    {
        title: 'roman',
        id: 2,
        packages: [{ title: 'konyha', id: 0 }],
    },

    {
        title: 'nemet',
        id: 3,
        packages: [{ title: 'kontttttyha', id: 3 }, { title: 'tt', id: 4 }],
    },
];

export default function Subjects(props) {
    const [state, setState] = useState({ newSubjectModalOpen: false });
    return (
        <div className="subject">
            <div className="folders">
                <button
                    className="new-subject btn btn-success"
                    onClick={() => setState({ ...state, newSubjectModalOpen: true })}
                >
                    <i className="fas fa-plus" />
                </button>
                <ListView data={data} baseRoute={props.match.url} />
            </div>
            <div className="cards">
                <Router>
                    <Switch location={props.location}>
                        <Route path={`${props.match.path}/:id`} component={CardsList} />
                        <Route path={`${props.match.path}`} component={CardsList} />
                    </Switch>
                </Router>
            </div>
            <Modal isOpen={state.newSubjectModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div className="modal-title">New subject</div>
                <Form
                    initialValues={{
                        subject: '',
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
                                    <button type="submit" className="btn btn-primary" onClick={() => {}}>
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
        </div>
    );
    function closeModal() {
        setState({ ...state, newSubjectModalOpen: false });
    }
}
