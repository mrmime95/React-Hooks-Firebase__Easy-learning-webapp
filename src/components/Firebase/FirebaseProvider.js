import React, { Component } from 'react';
import { auth, db, increment, decrement, storage } from './setup';
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
    render() {
        return (
            <FirebaseContext.Provider
                value={{
                    ...this.state,
                    db,
                    storage,
                    increment,
                    decrement,
                    doCreateUserWithEmailAndPassword: this.doCreateUserWithEmailAndPassword,
                    doSignInWithEmailAndPassword: this.doSignInWithEmailAndPassword,
                    doSignOut: this.doSignOut,
                    authUser: this.authUser,
                    createNewUser: this.createNewUser,
                    getSubjectsByCurrentUser: this.getSubjectsByCurrentUser,
                    getPackagesBySubjectId: this.getPackagesBySubjectId,
                    getCardsByPackageId: this.getCardsByPackageId,
                    getFriendRequestsNumber: this.getFriendRequestsNumber,
                    getDateTime: this.getDateTime,
                }}
            >
                {this.props.children}
            </FirebaseContext.Provider>
        );
    }
    authUser = () => {
        auth.onAuthStateChanged(user => {
            if (user && !user.isAnonymous) {
                const { uid } = user;
                this.getCurrentUser(uid);
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
            subjectsNumber: number,
            packagesNumber: number,
            cardsNumber: number,
        }
    ) => {
        db.doc(`users/${uid}`)
            .set({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                birthDate: values.birthDate ? values.birthDate : null,
                subjectsNumber: 0,
                packagesNumber: 0,
                cardsNumber: 0,
                role: 'user',
                createdAt: this.getDateTime(),
            })
            .then(() => {
                console.log('User Saved');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
        db.doc(`friendRequestNumber/${uid}`)
            .set({
                counter: 0,
            })
            .then(() => {
                console.log('requestCounter created');
            })
            .catch(error => {
                console.log('Got error: ', error);
            });
    };

    getCurrentUser = (uid: string) => {
        db.doc(`users/${uid}`)
            .get()
            .then(querySnapshot => {
                db.doc(`friendRequestNumber/${uid}`)
                    .get()
                    .then(querySnapshot2 => {
                        this.setState({
                            authReady: true,
                            isLoggedIn: true,
                            user: {
                                id: uid,
                                email: querySnapshot.data().email,
                                birthDate: querySnapshot.data().birthDate,
                                friendRequestsNumber: querySnapshot2.data().counter,
                                role: querySnapshot.data().role,
                                firstName: querySnapshot.data().firstName,
                                lastName: querySnapshot.data().lastName,
                            },
                        });
                    })
                    .catch(function(error) {
                        console.log('Error getting document: ', error);
                    });
            })
            .catch(function(error) {
                console.log('Error getting document: ', error);
            });
    };

    getFriendRequestsNumber = () => {
        db.collection(`friendRequestNumber`)
            .where('requestedId', '==', this.state.user.id)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'modified') {
                        console.log('Modified city: ', change.doc.data());
                        const user = this.state.user;
                        user.friendRequestsNumber = change.doc.data().counter;
                        this.setState(user);
                    }
                });
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

    getDateTime = () => {
        const today = new Date();
        return (
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate() +
            ' ' +
            today.getHours() +
            ':' +
            today.getMinutes() +
            ':' +
            today.getSeconds()
        );
    };
}
