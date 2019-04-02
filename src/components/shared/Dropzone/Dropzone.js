import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function MyDropzone(props: {onDrop: ()=>void}) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ props.onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>
    );
}
