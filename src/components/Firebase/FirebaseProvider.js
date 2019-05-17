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
            email: string,
            birthDate: string,
        }
    ) => {
        db.doc(`users/${uid}`)
            .set({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                birthDate: values.birthDate ? values.birthDate : null,
            })
            .then(() => {
                console.log('User Saved');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
    };

    getSubjectsByCurrentUser = () => {
        const ref = db.collection('subjects');
        return ref.where('userId', '==', this.state.user.id).get();
    };
    getPackagesBySubjectId = (subjectId: string) => {
        const ref = db.collection('packages');
        return ref.where('subjectId', '==', subjectId).get();
    };
    getCardsByPackageId = (packageId: string) => {
        const ref = db.collection('cards');
        return ref.where('packageId', '==', packageId).get();
    };

    render() {
        return (
            <FirebaseContext.Provider
                value={{
                    ...this.state,
                    db,
                    doCreateUserWithEmailAndPassword: this.doCreateUserWithEmailAndPassword,
                    doSignInWithEmailAndPassword: this.doSignInWithEmailAndPassword,
                    doSignOut: this.doSignOut,
                    authUser: this.authUser,
                    createNewUser: this.createNewUser,
                    getSubjectsByCurrentUser: this.getSubjectsByCurrentUser,
                    getPackagesBySubjectId: this.getPackagesBySubjectId,
                    getCardsByPackageId: this.getCardsByPackageId,
                }}
            >
                {this.props.children}
            </FirebaseContext.Provider>
        );
    }
}
