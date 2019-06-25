// @flow strict
import React, { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CurrentUserDetailContext = React.createContext();

function CurrentUserDetailProvider(props: { children: React$Node }) {
    const [user, setUser] = useState(undefined);
    const [tags, setTags] = useState(null);
    const [loading, setLoading] = useState(true);
    const fireContext = useContext(FirebaseContext);

    useEffect(() => {
        getUserData();
        getTags();
    }, []);

    return (
        <CurrentUserDetailContext.Provider
            value={{
                tags,
                user,
                loading,
                updateCurrentUser,
            }}
        >
            {props.children}
        </CurrentUserDetailContext.Provider>
    );

    function getUserData() {
        setLoading(true);
        fireContext.db
            .doc(`users/${fireContext.user.id}`)
            .get()
            .then(async querySnapshot => {
                if (querySnapshot.data()) {
                    setUser({
                        ...querySnapshot.data(),
                        id: props.userId,
                    });
                }

                setLoading(false);
            })
            .catch(function(error) {
                console.log('Error getting user document: ', error);
            });
    }
    function getTags() {
        fireContext.db
            .collection('tags')
            .get()
            .then(querySnapshot => {
                const suggestions = [];
                querySnapshot.forEach(doc => {
                    suggestions.push({ ...doc.data() });
                });
                setTags(suggestions);
            });
    }

    async function updateCurrentUser(data: { firstName: string, lastName: string, birthDate: string, tags: [string] }) {
        const profilePictureUrl = await uploadImage({
            profilePicture: data.profilePicture,
            profilePictureUrl: data.profilePictureUrl,
        });

        const currentUserRef = fireContext.db.doc(`users/${fireContext.user.id}`);
        const batch = fireContext.db.batch();
        batch.update(currentUserRef, {
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            tags: data.tags.map(tag => tag.value),
            profilePicture: profilePictureUrl,
        });
        batch.commit();

        getUserData();
    }

    async function uploadImage(side) {
        return new Promise(async (resolve, reject) => {
            if (side.profilePicture) {
                const storageRef = fireContext.storage.ref('cardImages');
                const imageRef = await storageRef.child(Math.random() + side.profilePicture.name);
                const uploadImage = imageRef.put(side.profilePicture);
                uploadImage.on(
                    'state_changed',
                    snapshot => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    error => {
                        console.log('Front image Uploading error:', error);
                        reject(error);
                    },
                    () => {
                        resolve(uploadImage.snapshot.ref.getDownloadURL());
                    }
                );
            } else {
                resolve(side.profilePictureUrl);
            }
        });
    }
}

export default CurrentUserDetailProvider;
