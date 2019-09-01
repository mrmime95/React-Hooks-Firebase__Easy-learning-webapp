import React, { useState, useContext } from 'react';

import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { Redirect, Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const [state, setState] = useState({
        email: '',
        password: '',
    });

    const handleChange = e => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const context = useContext(FirebaseContext);
    if (context.userIn) {
        return <Redirect to="/" />;
    }
    return (
        <div className="login-page">
            <div className="form">
                <form className="login-form">
                    <input
                        value={state.email}
                        onChange={handleChange}
                        type="email"
                        name="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Email"
                    />
                    <input
                        value={state.password}
                        onChange={handleChange}
                        type="password"
                        name="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            context.doSignInWithEmailAndPassword(state.email, state.password).catch(error => {
                                alert(error.message);
                            });
                        }}
                    >
                        Login
                    </button>
                    <button type="button" onClick={resetPassword}>
                        Reset Password
                    </button>
                    <div
                        id="customBtn"
                        className="customGPlusSignIn"
                        onClick={() => {
                            context
                                .doCreateUserWithGoogle()
                                .then(result => {
                                    var user = result.user;
                                    context.userExists(user.uid).then(exists => {
                                        if (!exists) {
                                            context.createNewUser(user.uid, {
                                                firstName: user.displayName.split(' ')[0],
                                                lastName: user.displayName.split(' ')[1],
                                                email: user.email,
                                            });
                                        }
                                    });
                                })
                                .catch(error => {
                                    alert(error.message);
                                });
                        }}
                    >
                        <span className="icon" />
                        <span className="buttonText">Google</span>
                    </div>
                    <p className="message">
                        Not registered?
                        <Link to="/signup"> Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
    function resetPassword() {
        if (state.email === '') {
            alert('Please give us your email');
            return;
        }

        context
            .doSendPasswordResetEmail(state.email)
            .then(() => {
                alert('Password reset email sent!');
            })
            .catch(error => {
                alert(error.message);
            });
    }
}
export default Login;
