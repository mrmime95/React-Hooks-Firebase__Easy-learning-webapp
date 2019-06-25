import React, { useState, useContext } from 'react';
import Modal from '../../../shared/Modal/Modal';
import { SubjectsContext } from '../../SubjectsProvider/SubjectsProvider';
import Form from '../../../shared/Form/Form';
import FormTags from '../../../shared/FormTags/FormTags';

function ListPack(props: {
    onClick: string => {},
    pack: { id: string, packageName: string, publicForFriends: boolean, publicForEveryone: boolean, tags: [string] },
    subjectId: string,
}) {
    const { pack } = props;
    const context = useContext(SubjectsContext);
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
                <button
                    className="btn btn-dark"
                    onClick={() => {
                        context.deletePackageById(pack.id, props.subjectId);
                    }}
                >
                    <i className="far fa-trash-alt" />
                </button>
                <button
                    className="btn btn-dark"
                    onClick={() => {
                        context.downloadPackage(pack.id);
                    }}
                >
                    <i className="fas fa-file-download" />
                </button>
            </div>
            <Modal isOpen={state.editPackageModalOpen} handleClickOutside={closeModal} className="one-line-modal">
                <div className="modal-title">Edit {pack.packageName} package</div>
                <Form
                    initialValues={{
                        packageName: pack.packageName,
                        publicForEveryone: pack.publicForEveryone,
                        tags: pack.tags.map(tag => {
                            return { id: tag, text: tag };
                        }),
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
        </div>
    );
    function closeModal() {
        setState({
            ...state,
            editPackageModalOpen: false,
        });
    }
}

export default ListPack;
