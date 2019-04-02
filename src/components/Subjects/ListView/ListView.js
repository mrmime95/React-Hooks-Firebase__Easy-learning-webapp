import React, { useState } from 'react';
import './ListView.css';

export default function ListView(props: {
    data: [{ title: string, id: number, packages: [{ title: string, id: number, path: string }] }],
}) {
    return (
        <div className="list">
            {props.data.map(subject => {
                return <ListSubject subject={subject} key={Math.random()} />;
            })}
        </div>
    );
}

function ListSubject(props: {
    subject: { title: string, id: number, packages: [{ title: string, id: number, path: string }] },
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
                {props.subject.packages.map((pack, i) => {
                    return <ListPackage pack={pack} key={Math.random()} />;
                })}
            </div>
        </div>
    );
}

function ListPackage(props: { pack: { title: string, id: number, path: string } }) {
    const [state, setState] = useState({
        open: false,
    });
    return (
        <div
            className="pack"
            key={Math.random()}
            onClick={() => {
                setState({ ...state, open: !state.open });
            }}
        >
            {state.open ? <i className="far fa-eye" /> : <i className="fas fa-archive" />}
            <span className="text">{props.pack.title}</span>
        </div>
    );
}
