import React, { Component } from 'react';
import { auth, db, increment, decrement, storage, googleProvider } from './setup';
export const FirebaseContext = React.createContext();
export const FirebaseConsumer = FirebaseContext.Consumer;

export default class FirebaseProvider extends Component {
    state = {
        authReady: false,
        isLoggedIn: false,
        user: null,
        requestNumber: 0,
        requesters: [],
        suggestions: [],
    };

    componentDidMount() {
        this.getSuggestions();
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
                    doCreateUserWithGoogle: this.doCreateUserWithGoogle,
                    doSignOut: this.doSignOut,
                    authUser: this.authUser,
                    createNewUser: this.createNewUser,
                    getSubjectsByCurrentUser: this.getSubjectsByCurrentUser,
                    getPackagesBySubjectId: this.getPackagesBySubjectId,
                    getCardsByPackageId: this.getCardsByPackageId,
                    getFriendRequestNumber: this.getFriendRequestNumber,
                    getDateTime: this.getDateTime,
                    getAllFriendsId: this.getAllFriendsId,
                    refreshFriends: this.refreshFriends,
                    createNewTag: this.createNewTag,
                    getSuggestions: this.getSuggestions,
                    copyNewCardForPackage: this.copyNewCardForPackage,
                    copyPackage: this.copyPackage,
                    createNewSubject: this.createNewSubject,
                    deleteCardById: this.deleteCardById,
                    deletePackageById: this.deletePackageById,
                    deleteSubjectById: this.deleteSubjectById,
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
                console.log(user);
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

    doCreateUserWithGoogle = () => {
        return auth.signInWithPopup(googleProvider);
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
            tags?: [string],
        }
    ) => {
        db.doc(`users/${uid}`)
            .set({
                birthDate: values.birthDate ? values.birthDate : null,
                cardsNumber: 0,
                createdAt: this.getDateTime(),
                email: values.email,
                firstName: values.firstName,
                friendCounter: 0,
                friends: [],
                lastName: values.lastName,
                packagesNumber: 0,
                role: 'user',
                subjectsNumber: 0,
                tags: values.tags ? values.tags.map(tag => tag.id) : [],
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
            .then(async querySnapshot => {
                const requesters = await this.getAllRequesters(uid);
                this.setState({
                    authReady: true,
                    isLoggedIn: true,
                    user: {
                        ...querySnapshot.data(),
                        id: uid,
                    },
                    requesters,
                });
            })
            .catch(function(error) {
                console.log('Error getting user document: ', error);
            });

        db.doc(`friendRequestNumber/${uid}`)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.data()) {
                    this.setState({
                        requestNumber: querySnapshot.data().counter,
                    });
                }
            })
            .catch(function(error) {
                console.log('Error getting document: ', error);
            });
    };

    getFriendRequestNumber = () => {
        db.collection(`friendRequestNumber`)
            .where('requestedId', '==', this.state.user.id)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(async change => {
                    if (change.type === 'modified') {
                        console.log(change.doc.data().counter);
                        const requesters = await this.getAllRequesters(this.state.user.id);
                        const friends = await this.getAllFriendsId();
                        const user = this.state.user;
                        user.friends = friends;
                        this.setState({ requestNumber: change.doc.data().counter, requesters, user });
                    }
                });
            });
    };

    refreshFriends = async () => {
        const friends = await this.getAllFriendsId();
        const user = this.state.user;
        user.friends = friends;
        this.setState({ user });
    };

    getAllFriendsId = async () => {
        const thisUser = await db
            .collection('users')
            .doc(this.state.user.id)
            .get();
        console.log(thisUser.data());
        return thisUser.data().friends;
    };

    getAllRequesters = async (uid: string) => {
        const friendRequestNumber = await db
            .collection('friendRequestNumber')
            .doc(uid)
            .get();
        const requesters = friendRequestNumber.data().requesters;

        if (requesters) {
            const requesterUsers = await Promise.all(
                requesters.map(async (requester, index) => {
                    const friendRequesters = await db
                        .collection('users')
                        .doc(requester)
                        .get();
                    return {
                        id: friendRequesters.id,
                        email: friendRequesters.data().email,
                        name: `${friendRequesters.data().firstName} ${friendRequesters.data().lastName}`,
                        birthDate: friendRequesters.data().birthDate,
                        subjects: friendRequesters.data().subjectsNumber,
                        packages: friendRequesters.data().packagesNumber,
                        cards: friendRequesters.data().cardsNumber,
                        role: friendRequesters.data().role,
                    };
                })
            );
            return requesterUsers;
        } else {
            return [];
        }
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

    createNewTag = (tag: { id: string, text: string }) => {
        if (!this.state.suggestions.find(suggest => suggest.id === tag.id)) {
            db.collection(`tags`)
                .doc(tag.id)
                .set({ ...tag })
                .then(() => {
                    console.log('Tag Created');
                    const suggestions = this.state.suggestions;
                    suggestions.push({ ...tag });
                    this.setState({ suggestions });
                })
                .catch(error => {
                    console.log('Got error: ', error);
                });
        }
    };

    getSuggestions = () => {
        db.collection('tags')
            .get()
            .then(querySnapshot => {
                const suggestions = [];
                querySnapshot.forEach(doc => {
                    suggestions.push({ ...doc.data() });
                });
                this.setState({ suggestions });
            });
    };
    /* ----------Copying---------- */

    copyNewCardForPackage = (
        packageId,
        front: { imageUrl: string, word: string, example: string },
        back: { imageUrl: string, word: string, example: string },
        correct: string,
        isLast: boolean
    ) => {
        const batch = db.batch();
        const cardsRef = db.collection('cards');
        const userRef = db.collection('users').doc(this.state.user.id);
        const packageRef = db.collection('packages').doc(packageId);

        cardsRef
            .add({
                front,
                back,
                packageId,
                knowledge: 1,
                correct: correct || null,
                createdAt: this.getDateTime(),
            })
            .then(docRef => {
                if (isLast) {
                    alert('copy done');
                }
            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });
        batch.update(packageRef, { cardsNumber: increment });
        batch.update(userRef, { cardsNumber: increment });
        batch.commit();
    };

    copyPackage = (values: {
        packageName: string,
        publicForEveryone: boolean,
        tags: [string],
        cardsNumber: number,
        correctsNumber: number,
        incorrectsNumber: number,
        subjectId: string,
        createdBy: {
            id: string,
            fullName: string,
            createdAt: string,
        },
    }) => {
        const batch = db.batch();
        const packagesRef = db.collection('packages').doc();
        const userRef = db.collection('users').doc(this.state.user.id);

        batch.set(packagesRef, {
            ...values,
        });
        batch.update(userRef, { packagesNumber: increment });
        batch.commit();
        return packagesRef.id;
    };

    createNewSubject = (subjectName: string) => {
        const batch = db.batch();
        const subjectsRef = db.collection('subjects').doc();
        const userRef = db.collection('users').doc(this.state.user.id);
        batch.set(subjectsRef, {
            subjectName,
            userId: this.state.user.id,
            createdAt: this.getDateTime(),
        });
        batch.update(userRef, { subjectsNumber: increment });
        batch.commit();
        return subjectsRef;
    };

    /* ------------------------------ */

    /* --------------delete------------ */
    deleteCardById = cardId => {
        return db
            .collection('cards')
            .doc(cardId)
            .delete();
    };
    deletePackageById = packId => {
        return db
            .collection('packages')
            .doc(packId)
            .delete();
    };
    deleteSubjectById = subjectId => {
        return db
            .collection('subjects')
            .doc(subjectId)
            .delete();
    };
}
