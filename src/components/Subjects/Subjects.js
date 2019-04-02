import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import FlipCard from '../shared/FlipCard/FlipCard';
import ListView from './ListView/ListView';
import './Subjects.css';

const data = [
    {
        title: 'angol',
        id: 0,
        packages: [
            { title: 'konyha', id: 0, path: '/konyha' },
            { title: 'dd', id: 1, path: '/konyha' },
            { title: 'gg', id: 2, path: '/konyha' },
            { title: 'kontttttyha', id: 3, path: '/konyha' },
            { title: 'tt', id: 4, path: '/konyha' },
        ],
    },
    {
        title: 'matek',
        id: 1,
        packages: [
            { title: 'konyha', id: 0, path: '/konyha' },
            { title: 'dd', id: 1, path: '/konyha' },
            { title: 'gg', id: 2, path: '/konyha' },
            { title: 'kontttttyha', id: 3, path: '/konyha' },
            { title: 'tt', id: 4, path: '/konyha' },
        ],
    },

    {
        title: 'roman',
        id: 2,
        packages: [{ title: 'konyha', id: 0, path: '/konyha' }],
    },

    {
        title: 'nemet',
        id: 3,
        packages: [{ title: 'kontttttyha', id: 3, path: '/konyha' }, { title: 'tt', id: 4, path: '/konyha' }],
    },
];

export default function Subjects(props) {
    return (
        <div className="subject">
            <div className="folders">
                <ListView data={data} />
            </div>
            <div className="cards">Cards</div>
        </div>
    );
}
