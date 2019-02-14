import React, { Component } from 'react';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const FirebaseContext = React.createContext();
export const FirebaseConsumer = FirebaseContext.Consumer;

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

export default class FirebaseProvider extends Component {
    constructor() {
        super();
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }
    state = {
        userIn: null,
    };

    componentDidMount() {
        this.authUser();
    }

    authUser = () => {
        this.auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ userIn: user });
            } else {
                this.setState({ userIn: null });
            }
        });
    };

    doCreateUserWithEmailAndPassword = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    };

    doSignInWithEmailAndPassword = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    };
    doSignOut = () => {
        return this.auth.signOut();
    };

    doPasswordReset = email => {
        return this.auth.sendPasswordResetEmail(email);
    };

    doPasswordUpdate = password => {
        return this.auth.currentUser.updatePassword(password);
    };

    user = uid => {
        return this.db.ref(`users/${uid}`);
    };

    users = () => {
        return this.db.ref('users');
    };

    render() {
        return (
            <FirebaseContext.Provider
                value={{
                    ...this.state,
                    doCreateUserWithEmailAndPassword: this.doCreateUserWithEmailAndPassword,
                    doSignInWithEmailAndPassword: this.doSignInWithEmailAndPassword,
                    doSignOut: this.doSignOut,
                    doPasswordReset: this.doPasswordReset,
                    doPasswordUpdate: this.doPasswordUpdate,
                    user: this.user,
                    users: this.users,
                    authUser: this.authUser,
                }}
            >
                {this.props.children}
            </FirebaseContext.Provider>
        );
    }
}
