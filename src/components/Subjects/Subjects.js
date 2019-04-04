import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import FlipCard from '../shared/FlipCard/FlipCard';
import ListView from './ListView/ListView';
import './Subjects.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import CardsList from './CardsList/CardsList';

const data = [
    {
        title: 'angol',
        id: 0,
        packages: [
            { title: 'konyha', id: 0 },
            { title: 'dd', id: 1 },
            { title: 'gg', id: 2 },
            { title: 'kontttttyha', id: 3 },
            { title: 'tt', id: 4 },
        ],
    },
    {
        title: 'matek',
        id: 1,
        packages: [
            { title: 'konyha', id: 0 },
            { title: 'dd', id: 1 },
            { title: 'gg', id: 2 },
            { title: 'kontttttyha', id: 3 },
            { title: 'tt', id: 4 },
        ],
    },

    {
        title: 'roman',
        id: 2,
        packages: [{ title: 'konyha', id: 0 }],
    },

    {
        title: 'nemet',
        id: 3,
        packages: [{ title: 'kontttttyha', id: 3 }, { title: 'tt', id: 4 }],
    },
];

export default function Subjects(props) {
    return (
        <div className="subject">
            <div className="folders">
                <ListView data={data} baseRoute={props.match.url} />
            </div>
            <div className="cards">
                <Router>
                    <Switch location={props.location}>
                        <Route path={`${props.match.path}/:id`} component={CardsList} />
                    </Switch>
                </Router>
            </div>
        </div>
    );
}
