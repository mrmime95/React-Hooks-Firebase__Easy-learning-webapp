import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Modal from '../../shared/Modal/Modal';
import './ListView.css';

export default function ListView(props: {
    data: [{ title: string, id: number, packages: [{ title: string, id: number }] }],
    baseRoute: string,
    opened: string,
}) {
    return (
        <div className="list">
            {props.data.map((subject, index) => {
                return (
                    <ListSubject
                        baseRoute={props.baseRoute}
                        opened={props.opened}
                        subject={subject}
                        key={`listSubject${index}`}
                    />
                );
            })}
        </div>
    );
}

function ListSubject(props: {
    subject: { title: string, id: number, packages: [{ title: string, id: number }] },
    baseRoute: string,
    opened: string,
}) {
    const [state, setState] = useState({
        open: false,
        newPackageModalOpen: false,
        setSubjectNameModalOpen: false,
    });
    return (
        <div className={`list-subject ${state.open && 'open'}`}>
            <div className="title">
                <div
                    className="text"
                    onClick={() => {
                        setState({ ...state, open: !state.open });
                    }}
                >
                    {state.open ? <i className="far fa-folder-open" /> : <i className="far fa-folder" />}
                    <span className="text">{props.subject.title}</span>
                </div>
                <div className="subject-options">
                    <button className="btn btn-dark" onClick={() => setState({ ...state, newPackageModalOpen: true })}>
                        <i className="fas fa-plus" />
                    </button>
                    <button
                        className="btn btn-dark"
                        onClick={() => setState({ ...state, setSubjectNameModalOpen: true })}
                    >
                        <i className="fas fa-ellipsis-h" />
                    </button>
                </div>
            </div>
            <div className="packages">
                {props.subject.packages.map((pack, index) => {
                    return <ListPackage baseRoute={props.baseRoute} pack={pack} key={`ListPackage${index}`} />;
                })}
            </div>
            <Modal isOpen={state.newPackageModalOpen} handleClickOutside={closeModal}>
                <div>New package</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </Modal>
            <Modal isOpen={state.setSubjectNameModalOpen} handleClickOutside={closeModal}>
                <div>Set subject name</div>
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
        setState({ ...state, newPackageModalOpen: false, setSubjectNameModalOpen: false });
    }
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
