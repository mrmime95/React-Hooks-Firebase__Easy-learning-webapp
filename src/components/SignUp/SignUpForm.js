import React from 'react';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

export default class SignUpForm extends React.Component {
    state = { ...INITIAL_STATE };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    onSubmit = event => {
        const { email, passwordOne } = this.state;

        this.props
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                /* this.props.history.push(ROUTES.HOME); */
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    render() {
        const { username, email, passwordOne, passwordTwo, error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Full Name" />
                <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email Address" />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
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
    }
}
