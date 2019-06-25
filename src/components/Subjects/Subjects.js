import React, { useState, useContext } from 'react';
import ListView from './ListView/ListView';
import './Subjects.css';
import Form from '../shared/Form/Form';
import Modal from '../shared/Modal/Modal';
import SubjectsProvider, { SubjectsContext } from './SubjectsProvider/SubjectsProvider';

import CardsList from './CardsList/CardsList';

export default function Subjects(props) {
    return (
        <SubjectsProvider>
            <SubjectsContent {...props} />
        </SubjectsProvider>
    );
}

function SubjectsContent(props) {
    const context = useContext(SubjectsContext);
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
                <ListView data={context.subjects} baseRoute={props.match.url} />
            </div>
            <div className="cards">
                <CardsList />
            </div>
            <Modal isOpen={state.newSubjectModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div className="modal-title">New subject</div>
                <Form
                    initialValues={{
                        subject: '',
                    }}
                    onSubmit={values => {
                        context.createNewSubject(values.subject);
                        context.getSubjectsByCurrentUser();
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
        </div>
    );
    function closeModal() {
        setState({ ...state, newSubjectModalOpen: false });
    }
}
