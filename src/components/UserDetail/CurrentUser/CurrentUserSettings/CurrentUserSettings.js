// @flow strict

import React, { useContext } from 'react';
import Form from '../../../shared/Form/Form';
import { CurrentUserDetailContext } from './../CurrentUserDetailProvider/CurrentUserDetailProvider';
import PicureUploader from '../../../shared/PicureUploader/PicureUploader';
import MultiSelect from '../../../shared/MultiSelect/MultiSelect';

function CurrentUserSettings() {
    const context = useContext(CurrentUserDetailContext);
    console.log(context.user);
    return (
        <div className="tasks-tab">
            {!context.loading ? (
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
                    onSubmit={values => {
                        context.updateCurrentUser(values);
                    }}
                >
                    {(
                        { handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched },
                        FormRow
                    ) => {
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
                                    className="form-control"
                                    placeholder="Upload a picture"
                                />
                                <div className="form-group">
                                    <label htmlFor="firstName" className="col-sm-3 control-label">
                                        First Name
                                    </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="First Name"
                                            className="form-control"
                                            autoFocus
                                            required
                                            value={values.firstName}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName" className="col-sm-3 control-label">
                                        Last Name
                                    </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Last Name"
                                            className="form-control"
                                            autoFocus
                                            required
                                            value={values.lastName}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="birthDate" className="col-sm-3 control-label">
                                        Date of Birth
                                    </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="date"
                                            id="birthDate"
                                            name="birthDate"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="form-control"
                                            value={values.birthDate || 'yyyy-MM-dd'}
                                        />
                                    </div>
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
                                <button className="btn btn-primary btn-block" type="submit">
                                    Update Profile
                                </button>
                            </React.Fragment>
                        );
                    }}
                </Form>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default CurrentUserSettings;
