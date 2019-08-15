import React, { useContext } from 'react';
import Form from '../shared/Form/Form';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { Redirect, withRouter, Link } from 'react-router-dom';
import FormTags from '../shared/FormTags/FormTags';

import './SignUp.css';

export default withRouter(function SignUp(props: { history: any }) {
    const fireContext = useContext(FirebaseContext);
    if (fireContext.userIn) {
        return <Redirect to="/" />;
    }
    return (
        <div className="signup-page">
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
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-control"
                                required
                            />
                            <FormTags className="tags" name="tags" tags={values.tags} handleChange={handleChange} />
                            <button
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
                            <p className="message">*Required fields</p>
                            <p className="message">
                                Back to login?
                                <Link to="/login"> Login</Link>
                            </p>
                        </React.Fragment>
                    );
                }}
            </Form>
        </div>
    );
});
