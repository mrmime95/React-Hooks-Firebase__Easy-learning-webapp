import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Modal from '../../shared/Modal/Modal';
import { SubjectsContext } from '../SubjectsProvider/SubjectsProvider';
import Form from '../../shared/Form/Form';
import './ListView.css';

export default function ListView(props: {
    data: [{ title: string, id: number, packages: [{ title: string, id: number }] }],
    baseRoute: string,
    opened: string,
}) {
    return (
        <div className="list">
            {props.data ? (
                props.data.map((subject, index) => {
                    return (
                        <ListSubject
                            baseRoute={props.baseRoute}
                            opened={props.opened}
                            subject={subject}
                            key={`listSubject${index}`}
                        />
                    );
                })
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

function ListSubject(props: {
    subject: { title: string, id: number, packages: [{ title: string, id: number }] },
    baseRoute: string,
    opened: string,
}) {
    const [state, setState] = useState({
        open: false,
        newPackageModalOpen: false,
        setSubjectNameModalOpen: false,
        uploadModalOpen: false,
        publicPackage: false,
        openedPackage: '',
    });
    const context = useContext(SubjectsContext);
    return (
        <div className={`list-subject ${state.open && 'open'}`}>
            <div className="title">
                <div
                    className="text"
                    onClick={() => {
                        if (!state.open && !props.subject.packages) {
                            context.getPackagesBySubjectId(props.subject.id);
                        }
                        setState({ ...state, open: !state.open });
                    }}
                >
                    {state.open ? <i className="far fa-folder-open" /> : <i className="far fa-folder" />}
                    <span className="text">{props.subject.title}</span>
                </div>
                <div className="subject-options">
                    <button className="btn btn-dark" onClick={() => setState({ ...state, newPackageModalOpen: true })}>
                        <i className="fas fa-plus" />
                    </button>
                    <button className="btn btn-dark" data-for={`moreOptions${props.subject.id}`} data-tip>
                        <i className="fas fa-ellipsis-h" />
                    </button>
                </div>
            </div>
            <div className="packages">
                {context.packages[props.subject.id] ? (
                    context.packages[props.subject.id].map((pack, index) => {
                        return (
                            <div
                                className="pack"
                                onClick={() => {
                                    context.setSelectedPackage(pack.id);
                                }}
                                key={`package${pack.id}`}
                            >
                                {pack.id === context.selectedPackageId ? (
                                    <i className="far fa-eye" />
                                ) : (
                                    <i className="fas fa-archive" />
                                )}
                                <span className="text">{pack.title}</span>
                            </div>
                        );
                    })
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            <Modal isOpen={state.newPackageModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div className="modal-title">New package</div>
                <Form
                    initialValues={{
                        packageName: '',
                        public: false,
                    }}
                    onSubmit={values => {
                        context.createNewPackageForSubject(props.subject.id, values);
                        context.getPackagesBySubjectId(props.subject.id);
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
                                        type="text"
                                        className="form-control"
                                        placeholder="New package"
                                        name="packageName"
                                        value={values.packageName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="checkbox">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={values.public}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id="public"
                                        name="public"
                                    />
                                    <label className="form-check-label" htmlFor="public">
                                        Public
                                    </label>
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
            <Modal isOpen={state.setSubjectNameModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div>Set subject name</div>
                <form className="modal-form">
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Set subject name" />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={state.uploadModalOpen} handleClickOutside={closeModal}>
                <div>Set subject name</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </Modal>
        </div>
    );
    function closeModal() {
        setState({
            ...state,
            newPackageModalOpen: false,
            setSubjectNameModalOpen: false,
            uploadModalOpen: false,
            publicPackage: false,
        });
    }
}

function ListPackage(props: { baseRoute: string, pack: { title: string, id: number } }) {
    const [state, setState] = useState({
        open: false,
    });

    return (
        <div
            to={`${props.baseRoute}/${props.pack.id}`}
            className="pack"
            onClick={e => {
                setState({ ...state, open: !state.open });
            }}
        >
            {state.open ? <i className="far fa-eye" /> : <i className="fas fa-archive" />}
            <span className="text">{props.pack.title}</span>
        </div>
    );
}
