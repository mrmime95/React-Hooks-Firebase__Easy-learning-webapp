// @flow strict

import React, { useContext } from 'react';
import Form from '../../../shared/Form/Form';
import { CurrentUserDetailContext } from './../CurrentUserDetailProvider/CurrentUserDetailProvider';
import PicureUploader from '../../../shared/PicureUploader/PicureUploader';
import TextField from '../../../shared/formFields/TextField/TextField';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
import FormTags from '../../../shared/FormTags/FormTags';
import './CurrentUserSettings.css';

function CurrentUserSettings(props) {
    const context = useContext(CurrentUserDetailContext);
    const { createNewApproverRequest } = useContext(FirebaseContext);
    return (
        <div className="tasks-tab">
            <Form
                initialValues={{
                    firstName: context.user.firstName,
                    lastName: context.user.lastName,
                    birthDate: context.user.birthDate,
                    tags: context.user.tags.map(tag => {
                        return { id: tag, text: tag };
                    }),
                    profilePictureUrl: context.user.profilePicture || '',
                    profilePicture: null,
                }}
                enableReinitialize
                onSubmit={values => {
                    context.updateCurrentUser(values);
                }}
            >
                {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
                    return (
                        <React.Fragment>
                            <PicureUploader
                                nameUrl="profilePictureUrl"
                                nameImage="profilePicture"
                                imageUrl={values.profilePictureUrl}
                                handleChange={value => {
                                    handleChange(value);
                                    if (typeof value.target.value !== 'string') {
                                        let reader = new FileReader();

                                        reader.onloadend = () => {
                                            handleChange(
                                                (({
                                                    target: {
                                                        name: 'profilePictureUrl',
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
                                                    name: 'profilePicture',
                                                    value: null,
                                                },
                                            }: any): SyntheticInputEvent<any>)
                                        );
                                    }
                                }}
                                onBlur={handleBlur}
                                type="file"
                                label="Profile picture"
                                placeholder="Upload a picture"
                            />
                            <div className="form-group full-name">
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={values.firstName}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    type="text"
                                    placeholder=" First Name"
                                    required
                                    autoFocus
                                />
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={values.lastName}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    type="text"
                                    placeholder="Last Name"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    type="date"
                                    label="Birthday"
                                    name="birthDate"
                                    value={values.birthDate || 'yyyy-MM-dd'}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />
                            </div>
                            <FormTags
                                label="Your tags:"
                                creator
                                name="tags"
                                tags={values.tags}
                                handleChange={handleChange}
                                placeholder="Add your strength"
                            />

                            <div className="buttons">
                                <button className="btn btn-primary btn-block" type="submit">
                                    Update Profile
                                </button>
                                {values.tags.length !== 0 && (
                                    <button
                                        className="btn btn-primary btn-block"
                                        type="button"
                                        onClick={() => createNewApproverRequest(values.tags)}
                                    >
                                        Become an approver for this tags
                                    </button>
                                )}
                            </div>
                        </React.Fragment>
                    );
                }}
            </Form>
        </div>
    );
}

export default CurrentUserSettings;
