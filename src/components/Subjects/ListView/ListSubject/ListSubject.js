import React, { useState, useContext } from 'react';
import Modal from '../../../shared/Modal/Modal';
import { SubjectsContext } from '../../SubjectsProvider/SubjectsProvider';
import Form from '../../../shared/Form/Form';
import FormTags from '../../../shared/FormTags/FormTags';
import ListPack from '../ListPack/ListPack';

export default function ListSubject(props: {
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
                    <button className="btn btn-dark" onClick={() => context.deleteSubjectById(props.subject.id)}>
                        <i className="far fa-trash-alt" />
                    </button>
                    <button className="btn btn-dark upload-button">
                        <i className="fas fa-file-upload" />
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            name="fileuploader"
                            onChange={e => context.fileChangedHandler(e, props.subject.id)}
                            className="form-control"
                            placeholder="Upload a file"
                        />
                    </button>
                </div>
            </div>
            <div className="packages">
                {context.packages[props.subject.id] ? (
                    context.packages[props.subject.id].map((pack, index) => {
                        return (
                            <ListPack
                                pack={pack}
                                onClick={() => context.getCardsByPackageId(pack.id)}
                                subjectId={props.subject.id}
                                key={`package${pack.id}`}
                            />
                        );
                    })
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            <Modal isOpen={state.newPackageModalOpen} handleClickOutside={closeModal}>
                <div className="modal-title">New package</div>
                <Form
                    initialValues={{
                        packageName: '',
                        publicForEveryone: false,
                        tags: [],
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
                                <div className="form-group form-tags">
                                    <FormTags name="tags" tags={values.tags} handleChange={handleChange} />
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
