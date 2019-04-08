import React, { useState } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import FlipCard from '../shared/FlipCard/FlipCard';
import ListView from './ListView/ListView';
import './Subjects.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Modal from '../shared/Modal/Modal';

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
    const [state, setState] = useState({ newSubjectModalOpen: false });
    return (
        <div className="subject">
            <div className="folders">
                <button className="new-subject btn btn-success">
                    <i className="fas fa-plus" />
                </button>
                <ListView data={data} baseRoute={props.match.url} />
            </div>
            <div className="cards">
                <button
                    className="new-card btn btn-success"
                    onClick={() => setState({ ...state, newSubjectModalOpen: true })}
                >
                    <i className="fas fa-plus" />
                </button>
                <Router>
                    <Switch location={props.location}>
                        <Route path={`${props.match.path}/:id`} component={CardsList} />
                        <Route path={`${props.match.path}`} component={CardsList} />
                    </Switch>
                </Router>
            </div>
            <Modal isOpen={state.newSubjectModalOpen} handleClickOutside={closeModal}>
                <div>New subject</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </Modal>
        </div>
    );
    function closeModal() {
        setState({ ...state, newSubjectModalOpen: false });
    }
}
