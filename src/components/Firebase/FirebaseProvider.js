import React, { Component } from 'react';
import { auth, db } from './setup';
export const FirebaseContext = React.createContext();
export const FirebaseConsumer = FirebaseContext.Consumer;

export default class FirebaseProvider extends Component {
    state = {
        authReady: false,
        isLoggedIn: false,
        user: null,
    };

    componentDidMount() {
        this.authUser();
    }

    authUser = () => {
        auth.onAuthStateChanged(user => {
            if (user && !user.isAnonymous) {
                const { uid, email, displayName } = user;
                this.setState({
                    authReady: true,
                    isLoggedIn: true,
                    user: {
                        id: uid,
                        email,
                        displayName,
                    },
                });
            } else {
                this.setState({ authReady: true, isLoggedIn: false, user: null });
            }
        });
    };

    doCreateUserWithEmailAndPassword = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    doSignInWithEmailAndPassword = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };
    doSignOut = () => {
        return auth.signOut();
    };

    createNewUser = (
        uid: string,
        values: {
            firstName: string,
            lastName: string,
            username: string,
            email: string,
            birthDate: string,
        }
    ) => {
        db.doc(`users/${uid}`)
            .set({
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                email: values.email,
                birthDate: values.birthDate,
            })
            .then(() => {
                console.log('User Saved');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
    };

    createNewSubject = () => {};

    render() {
        return (
            <FirebaseContext.Provider
                value={{
                    ...this.state,
                    doCreateUserWithEmailAndPassword: this.doCreateUserWithEmailAndPassword,
                    doSignInWithEmailAndPassword: this.doSignInWithEmailAndPassword,
                    doSignOut: this.doSignOut,
                    authUser: this.authUser,
                    createNewUser: this.createNewUser,
                }}
            >
                {this.props.children}
            </FirebaseContext.Provider>
        );
    }
}
