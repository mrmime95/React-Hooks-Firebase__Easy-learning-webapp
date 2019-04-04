import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './ListView.css';

export default function ListView(props: {
    data: [{ title: string, id: number, packages: [{ title: string, id: number }] }],
    baseRoute: string,
}) {
    return (
        <div className="list">
            {props.data.map((subject, index) => {
                return <ListSubject baseRoute={props.baseRoute} subject={subject} key={`listSubject${index}`} />;
            })}
        </div>
    );
}

function ListSubject(props: {
    subject: { title: string, id: number, packages: [{ title: string, id: number }] },
    baseRoute: string,
}) {
    const [state, setState] = useState({
        open: false,
    });
    return (
        <div className={`list-subject ${state.open && 'open'}`}>
            <div
                className="title"
                onClick={() => {
                    setState({ ...state, open: !state.open });
                }}
            >
                {state.open ? <i className="far fa-folder-open" /> : <i className="far fa-folder" />}
                <span className="text">{props.subject.title}</span>
            </div>
            <div className="packages">
                {props.subject.packages.map((pack, index) => {
                    return <ListPackage baseRoute={props.baseRoute} pack={pack} key={`ListPackage${index}`} />;
                })}
            </div>
        </div>
    );
}

function ListPackage(props: { baseRoute: string, pack: { title: string, id: number } }) {
    const [state, setState] = useState({
        open: false,
    });

    return (
        <Link
            to={`${props.baseRoute}/${props.pack.id}`}
            className="pack"
            onClick={e => {
                setState({ ...state, open: !state.open });
            }}
        >
            {state.open ? <i className="far fa-eye" /> : <i className="fas fa-archive" />}
            <span className="text">{props.pack.title}</span>
        </Link>
    );
}
