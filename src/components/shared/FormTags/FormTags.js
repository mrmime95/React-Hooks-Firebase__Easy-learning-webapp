// @flow strict

import React, { useContext } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import './FormTags.css';

function FormTags(props: {
    handleChange: () => void,
    tags: [sting],
    readOnly?: boolean,
    className?: string,
    placeholder?: string,
    creator?: boolean,
}) {
    const fireContext = useContext(FirebaseContext);
    return (
        <div className={`form-tags ${props.className}`}>
            <ReactTags
                placeholder={props.placeholder || 'Add new tag'}
                tags={props.tags}
                suggestions={fireContext.suggestions}
                readOnly={props.readOnly}
                handleDelete={i => {
                    const newTags = props.tags.filter((tag, index) => index !== i);
                    props.handleChange({
                        target: {
                            name: props.name,
                            value: newTags,
                        },
                    });
                }}
                handleAddition={(tag, e) => {
                    const show = props.creator || fireContext.suggestions.find(suggest => suggest.id === tag.id);
                    console.log(show);
                    if (show) {
                        const newTags = [...props.tags, tag];
                        props.handleChange({
                            target: {
                                name: props.name,
                                value: newTags,
                            },
                        });
                        fireContext.createNewTag(tag);
                    } else {
                        alert("Here, you can't create new tags");
                    }
                }}
                autocomplete
                handleDrag={() => {}}
            />
        </div>
    );
}

export default FormTags;
