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

    createNewSubject = (subjectName: string) => {
        db.collection('subjects')
            .add({
                subjectName: subjectName,
                userId: this.state.user.id,
            })
            .then(() => {
                console.log('subject saved');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
    };
    createNewPackage = (subjectId: string, values: { packageName: string, public: boolean }) => {
        db.collection('packages')
            .add({
                packageName: values.packageName,
                public: values.public,
                subjectId,
            })
            .then(() => {
                console.log('package saved');
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
                    createNewSubject: this.createNewSubject,
                    createNewPackage: this.createNewPackage,
                    getSubjectsByCurrentUser: this.getSubjectsByCurrentUser,
                    getPackagesBySubjectId: this.getPackagesBySubjectId,
                }}
            >
                {this.props.children}
            </FirebaseContext.Provider>
        );
    }
}
