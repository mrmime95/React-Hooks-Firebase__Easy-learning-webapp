import React, { useState, useContext } from 'react';

import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { Redirect, Link } from 'react-router-dom';

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
        <div className="col-md-6">
            <form>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                        value={state.email}
                        onChange={handleChange}
                        type="email"
                        name="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input
                        value={state.password}
                        onChange={handleChange}
                        type="password"
                        name="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        context.doSignInWithEmailAndPassword(state.email, state.password);
                    }}
                    className="btn btn-primary"
                >
                    Login
                </button>
                <Link to="/signup" className="btn btn-primary">
                    Sign Up
                </Link>
            </form>
        </div>
    );
}
export default Login;
