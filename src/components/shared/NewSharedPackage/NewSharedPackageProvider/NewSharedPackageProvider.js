// @flow strict

import React, { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const NewSharedPackageContext = React.createContext();

function NewSharedPackageProvider(props: { children: React$Node }) {
    const [subjects, setSubjects] = useState(null);

    const fireContext = useContext(FirebaseContext);

    useEffect(() => {
        getSubjectsByCurrentUser();
    }, []);

    return (
        <NewSharedPackageContext.Provider
            value={{
                subjects,
                saveToUser,
            }}
        >
            {props.children}
        </NewSharedPackageContext.Provider>
    );
    function getSubjectsByCurrentUser() {
        fireContext
            .getSubjectsByCurrentUser()
            .then(querySnapshot => {
                const subjects = [];
                querySnapshot.forEach(doc => {
                    subjects.push({
                        id: doc.id,
                        title: doc.data().subjectName,
                    });
                });
                setSubjects(subjects);
            })
            .catch(function(error) {
                alert('Error getting documents: ', error);
            });
    }
    async function saveToUser(
        values: { subjectName: { id: string | null, value: string }, packageName: string },
        pack: {
            cardsNumber: number,
            correctNumber: number,
            createdBy: { fullName: string, createdAt: string, id: string },
            incorrectsNumber: number,
            packageName: string,
            publicForEveryone: boolean,
            publicForFriends: boolean,
            subjectId: string,
            tags: [string],
            words: [
                {
                    front: { example: string, image: string, imageUrl: string, word: string },
                    back: { example: string, image: string, imageUrl: string, word: string },
                    correct?: boolean,
                    cardId: string,
                },
            ],
        }
    ) {
        let subjectId;
        if (!values.subjectName.id) {
            subjectId = fireContext.createNewSubject(values.subjectName.value).id;
        } else {
            subjectId = values.subjectName.id;
        }

        const packageId = fireContext.copyPackage({
            packageName: values.packageName,
            publicForEveryone: pack.publicForEveryone,
            tags: pack.tags,
            cardsNumber: pack.tags,
            correctsNumber: pack.tags,
            incorrectsNumber: pack.tags,
            subjectId,
            createdBy: {
                id: fireContext.user.id,
                fullName: `${fireContext.user.firstName} ${fireContext.user.lastName}`,
                createdAt: fireContext.getDateTime(),
            },
        });
        pack.words.map((word, index) => {
            fireContext.copyNewCardForPackage(
                packageId,
                word.front,
                word.back,
                word.correct,
                index === pack.words.length - 1
            );
        });
        /* const subject = await subjectsRef.get(); */
    }
}

export default NewSharedPackageProvider;
