import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { useFormState } from 'react-use-form-state';
import FlipCard from '../shared/FlipCard/FlipCard';
import './CreateCard.css';

export default function CreateCard(props) {
    const context = useContext(FirebaseContext);
    const [state, setState] = useState({ word: '', image: null, imagePath: '', example: '' });

    return (
        <div className="create-card">
            <div className="card-side">
                <FlipCard
                    front={{
                        word: state.word,
                        image: state.imagePath,
                        example: state.example,
                    }}
                    back={{ word: 'word', image: 'image', example: 'example' }}
                />
                <form onSubmit={handleSubmit}>
                    <input type="text" name="word" className="form-control" placeholder="Word" onChange={onChange} />
                    <input type="file" name="image" className="form-control" onChange={onChange} />
                    <input
                        type="text"
                        name="example"
                        className="form-control"
                        placeholder="Example"
                        onChange={onChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="card-side">CardBack</div>
        </div>
    );

    function onChange(e) {
        if (e.target.files)
            setState({ ...state, image: e.target.files[0], imagePath: URL.createObjectURL(e.target.files[0]) });
        else {
            const { name, value } = e.target;
            setState({ ...state, [name]: value });
        }
        console.log('====================================');
        console.log(state);
        console.log('====================================');
    }
    function handleSubmit(e) {
        e.preventDefault();
        console.log('====================================');
        console.log(state);
        console.log('====================================');
    }
}
