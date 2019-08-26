// @flow strict

import React, { useContext } from 'react';
import Form from '../../../shared/Form/Form';
import { CurrentUserDetailContext } from './../CurrentUserDetailProvider/CurrentUserDetailProvider';
import PicureUploader from '../../../shared/PicureUploader/PicureUploader';
import MultiSelect from '../../../shared/MultiSelect/MultiSelect';
import TextField from '../../../shared/formFields/TextField/TextField';
import './CurrentUserSettings.css';

function CurrentUserSettings() {
    const context = useContext(CurrentUserDetailContext);
    return (
        <div className="tasks-tab">
            <Form
                initialValues={{
                    firstName: context.user.firstName,
                    lastName: context.user.lastName,
                    birthDate: context.user.birthDate,
                    tags: context.user.tags.map(tag => {
                        return { value: tag, label: tag };
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
                            <MultiSelect
                                label="Your tags:"
                                value={values.tags}
                                name="tags"
                                className="tags-select"
                                onChange={value => {
                                    handleChange({
                                        target: {
                                            name: 'tags',
                                            value,
                                        },
                                    });
                                }}
                                options={
                                    context.tags &&
                                    context.tags.map(tag => {
                                        return { value: tag.text, label: tag.text };
                                    })
                                }
                                placeholder="Select your tags"
                            />

                            <div className="buttons">
                                <button className="btn btn-primary btn-block" type="submit">
                                    Update Profile
                                </button>

                                <button
                                    className="btn btn-primary btn-block"
                                    type="button"
                                    onClick={() => console.log('request sending')}
                                >
                                    Become an approver for this tags
                                </button>
                            </div>
                        </React.Fragment>
                    );
                }}
            </Form>
        </div>
    );
}

export default CurrentUserSettings;
