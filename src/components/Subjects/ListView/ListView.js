import React, { useState, useContext } from 'react';
import Modal from '../../shared/Modal/Modal';
import { SubjectsContext } from '../SubjectsProvider/SubjectsProvider';
import { CardListContext } from '../CardsList/CardListProvider/CardListProvider';
import Form from '../../shared/Form/Form';
import './ListView.css';

export default function ListView(props: {
    data: [{ subjectName: string, id: number, packages: [{ packageName: string, id: number }] }],
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
    subject: { subjectName: string, id: number, packages: [{ packageName: string, id: number }] },
    baseRoute: string,
    opened: string,
}) {
    const [state, setState] = useState({
        open: false,
        newPackageModalOpen: false,
        uploadModalOpen: false,
        publicPackage: false,
        editSubjectModalOpen: false,
        openedPackage: '',
    });
    const context = useContext(SubjectsContext);
    const cardListContext = useContext(CardListContext);
    return (
        <div className={`list-subject ${state.open && 'open'}`}>
            <div className="subject-element">
                <div
                    className="text"
                    onClick={() => {
                        if (!state.open && !props.subject.packages) {
                            context.getPackagesBySubjectId(props.subject.id);
                        }
                        setState({ ...state, open: !state.open });
                        context.setSelectedSubject(props.subject.id);
                    }}
                >
                    {state.open ? <i className="far fa-folder-open" /> : <i className="far fa-folder" />}
                    <p className="subject-name">{props.subject.subjectName}</p>
                </div>
                <div className="subject-options">
                    <button className="btn btn-dark" onClick={() => setState({ ...state, newPackageModalOpen: true })}>
                        <i className="fas fa-plus" />
                    </button>
                    <button className="btn btn-dark" onClick={() => setState({ ...state, editSubjectModalOpen: true })}>
                        <i className="far fa-edit" />
                    </button>
                    <button className="btn btn-dark" onClick={() => setState({ ...state, editSubjectModalOpen: true })}>
                        <i className="far fa-trash-alt" />
                    </button>
                    <button className="btn btn-dark">
                        <i className="fas fa-file-upload" />
                    </button>
                </div>
            </div>
            <div className="packages">
                {context.packages[props.subject.id] ? (
                    context.packages[props.subject.id].map((pack, index) => {
                        return (
                            <ListPacks
                                pack={pack}
                                context={context}
                                onClick={() => cardListContext.getCardsByPackageId(pack.id)}
                                subjectId={props.subject.id}
                                key={`package${pack.id}`}
                            />
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
                        publicForFriends: false,
                        publicForEveryone: false,
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
                                        value={values.publicForFriends}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id="publicForFriends"
                                        name="publicForFriends"
                                    />
                                    <label className="form-check-label" htmlFor="publicForFriends">
                                        Public for firends
                                    </label>
                                </div>

                                <div className="checkbox">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={values.publicForEveryone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id="publicForEveryone"
                                        name="publicForEveryone"
                                    />
                                    <label className="form-check-label" htmlFor="publicForEveryone">
                                        Public for everyone
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
            <Modal isOpen={state.editSubjectModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div className="modal-title">Edit {props.subject.subjectName} subject</div>
                <Form
                    initialValues={{
                        subject: props.subject.subjectName,
                    }}
                    onSubmit={values => {
                        context.updateSubject(props.subject.id, values);
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
                                        placeholder="Edit subject"
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
        setState({
            ...state,
            newPackageModalOpen: false,
            setSubjectNameModalOpen: false,
            publicPackage: false,
            editSubjectModalOpen: false,
        });
    }
}

function ListPacks(props: {
    context: any,
    onClick: string => {},
    pack: { id: string, packageName: string, publicForFriends: boolean, publicForEveryone: boolean },
    subjectId: string,
}) {
    const { context, pack } = props;
    const [state, setState] = useState({
        editPackageModalOpen: false,
    });
    return (
        <div className="pack">
            <div
                className="text"
                onClick={() => {
                    context.setSelectedPackage(pack.id);
                    props.onClick();
                }}
            >
                {pack.id === context.selectedPackageId ? (
                    <i className="far fa-eye" />
                ) : (
                    <i className="fas fa-archive" />
                )}
                <span className="pack-name">{pack.packageName}</span>
            </div>
            <div className="pack-options">
                <button className="btn btn-dark" onClick={() => setState({ ...state, editPackageModalOpen: true })}>
                    <i className="far fa-edit" />
                </button>
                <button className="btn btn-dark">
                    <i className="far fa-trash-alt" />
                </button>
                <button className="btn btn-dark">
                    <i className="fas fa-file-download" />
                </button>
            </div>
            <Modal isOpen={state.editPackageModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div className="modal-title">Edit {pack.packageName} package</div>
                <Form
                    initialValues={{
                        packageName: pack.packageName,
                        publicForFriends: pack.publicForFriends,
                        publicForEveryone: pack.publicForEveryone,
                    }}
                    onSubmit={values => {
                        context.updatePackagesAtSubject(props.subjectId, pack.id, values);
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
                                        value={values.publicForFriends}
                                        defaultChecked={values.publicForFriends}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id="publicForFriends"
                                        name="publicForFriends"
                                    />
                                    <label className="form-check-label" htmlFor="publicForFriends">
                                        Public for friends
                                    </label>
                                </div>
                                <div className="checkbox">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={values.publicForEveryone}
                                        defaultChecked={values.publicForEveryone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id="publicForEveryone"
                                        name="publicForEveryone"
                                    />
                                    <label className="form-check-label" htmlFor="publicForEveryone">
                                        Public for everyone
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
        </div>
    );
    function closeModal() {
        setState({
            ...state,
            editPackageModalOpen: false,
        });
    }
}
