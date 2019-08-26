import React from 'react';
import './PicureUploader.css';
import TextField from '../formFields/TextField/TextField';

export default function PicureUploader({
    className,
    label,
    nameUrl,
    nameImage,
    handleChange,
    handleBlur,
    checked,
    image,
    imageUrl,
}) {
    return (
        <div className={`picure-uploader ${className || ''}`}>
            <div className="input-group mb-3">
                <TextField
                    label={label}
                    name={nameUrl}
                    value={imageUrl}
                    handleChange={fileChangedHandler}
                    handleBlur={handleBlur}
                    type="text"
                    placeholder="Add an Url"
                    AddExtra={() => (
                        <div className="upload-btn-wrapper">
                            <button className="upload-btn btn btn-light">Upload a file</button>
                            <input
                                type="file"
                                name={nameImage}
                                value={image}
                                onChange={fileChangedHandler}
                                onBlur={handleBlur}
                                className="form-control"
                                placeholder="Upload a picture"
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    );

    function fileChangedHandler(e) {
        if (e.target.files) {
            handleChange(
                (({
                    target: { name: nameImage, value: e.target.files[0] },
                }: any): SyntheticInputEvent<any>)
            );
        } else {
            handleChange(
                (({
                    target: { name: nameUrl, value: e.target.value },
                }: any): SyntheticInputEvent<any>)
            );
        }
    }
}
