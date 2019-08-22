// @flow strict

import React, { useContext } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import './FormTags.css';

function FormTags(props: { handleChange: () => void, tags: [sting], readOnly?: boolean, className?: string }) {
    const fireContext = useContext(FirebaseContext);
    return (
        <div className={`form-tags ${props.className}`}>
            <ReactTags
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
                handleAddition={tag => {
                    const newTags = [...props.tags, tag];
                    props.handleChange({
                        target: {
                            name: props.name,
                            value: newTags,
                        },
                    });
                    fireContext.createNewTag(tag);
                }}
                handleDrag={() => {}}
            />
        </div>
    );
}

export default FormTags;
