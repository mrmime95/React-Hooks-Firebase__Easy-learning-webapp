import React, { Component } from 'react';

import { FirebaseConsumer } from '../Firebase/FirebaseProvider';

class Login extends Component {
    state = {
        email: '',
        password: '',
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <FirebaseConsumer>
                {context => {
                    return (
                        <div className="col-md-6">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                    <input
                                        value={this.state.email}
                                        onChange={this.handleChange}
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
                                        value={this.state.password}
                                        onChange={this.handleChange}
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
                                        context.doSignInWithEmailAndPassword(this.state.email, this.state.password);
                                    }}
                                    className="btn btn-primary"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        context.doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
                                    }
                                    style={{ marginLeft: '25px' }}
                                    className="btn btn-success"
                                >
                                    Signup
                                </button>
                            </form>
                        </div>
                    );
                }}
            </FirebaseConsumer>
        );
    }
}
export default Login;
