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
                                .then(async result => {
                                    var token = result.credential.accessToken;
                                    var user = result.user;
                                    console.log(new Date());
                                    const docc = await context.db.collection('users').doc(user.uid).get;
                                    if (docc.exists)
                                        context.createNewUser(user.uid, {
                                            firstName: user.displayName.split(' ')[0],
                                            lastName: user.displayName.split(' ')[1],
                                            email: user.email,
                                        });
                                    console.log(user, token);
                                })
                                .catch(error => {
                                    // Handle Errors here.
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    // The email of the user's account used.
                                    var email = error.email;
                                    // The firebase.auth.AuthCredential type that was used.
                                    var credential = error.credential;
                                    // ...
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
