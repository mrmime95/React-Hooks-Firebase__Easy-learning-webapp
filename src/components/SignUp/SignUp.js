import React, { useContext, useState } from 'react';

import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { Redirect, withRouter } from 'react-router-dom';

export default withRouter(function SignUp(props: { history: any }) {
    const fireContext = useContext(FirebaseContext);
    if (fireContext.userIn) {
        return <Redirect to="/" />;
    }
    const [state, setState] = useState({ username: '', email: '', passwordOne: '', passwordTwo: '', error: null });

    const { username, email, passwordOne, passwordTwo, error } = state;

    const onChange = event => {
        setState({ ...state, [event.target.name]: event.target.value });
    };
    const onSubmit = event => {
        fireContext
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(() => {
                alert('signing in');
            })
            .catch(error => {
                alert(error);
            });

        event.preventDefault();
    };

    return (
        <form onSubmit={onSubmit}>
            <input name="username" value={username} onChange={onChange} type="text" placeholder="Full Name" />
            <input name="email" value={email} onChange={onChange} type="text" placeholder="Email Address" />
            <input name="passwordOne" value={passwordOne} onChange={onChange} type="password" placeholder="Password" />
            <input
                name="passwordTwo"
                value={passwordTwo}
                onChange={onChange}
                type="password"
                placeholder="Confirm Password"
            />
            <button
                disabled={passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === ''}
                type="submit"
            >
                Sign UpSign Up
            </button>

            {error && <p>{error.message}</p>}
        </form>
    );
});
