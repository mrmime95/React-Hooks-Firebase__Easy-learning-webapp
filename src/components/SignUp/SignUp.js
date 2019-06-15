import React, { useContext, useState } from 'react';
import Form from '../shared/Form/Form';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { Redirect, withRouter } from 'react-router-dom';
import FormTags from '../shared/FormTags/FormTags';

export default withRouter(function SignUp(props: { history: any }) {
    const fireContext = useContext(FirebaseContext);
    if (fireContext.userIn) {
        return <Redirect to="/" />;
    }
    return (
        <Form
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password1: '',
                password2: '',
                birthDate: '',
                tags: [],
            }}
        >
            {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
                return (
                    <React.Fragment>
                        <h2>Registration</h2>
                        <div className="form-group">
                            <label htmlFor="firstName" className="col-sm-3 control-label">
                                First Name*
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
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="col-sm-3 control-label">
                                Last Name*
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
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="col-sm-3 control-label">
                                Email*
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Email"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password1" className="col-sm-3 control-label">
                                Password*
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="password"
                                    id="password1"
                                    name="password1"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Password"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password2" className="col-sm-3 control-label">
                                Confirm Password*
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Password"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate" className="col-sm-3 control-label">
                                Date of Birth*
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate" className="col-sm-3 control-label">
                                Your tags
                            </label>
                            <div className="col-sm-9">
                                <FormTags name="tags" tags={values.tags} handleChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-9 col-sm-offset-3">
                                <span className="help-block">*Required fields</span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-block"
                            type="button"
                            onClick={() => {
                                fireContext
                                    .doCreateUserWithEmailAndPassword(values.email, values.password1)
                                    .then(credential => {
                                        alert('signing in');
                                        fireContext.createNewUser(credential.user.uid, values);
                                    })
                                    .catch(error => {
                                        alert(error);
                                    });
                            }}
                        >
                            Register
                        </button>
                    </React.Fragment>
                );
            }}
        </Form>
    );
});
