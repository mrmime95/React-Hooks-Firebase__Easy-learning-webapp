// @flow
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Octicon from '@githubprimer/octicons-react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import './Menu.css';

export default function Menu(props) {
    const { className, items } = props;

    return (
        <ul className={'menu' + (className ? ' ' + className : '')}>
            {Object.keys(items).map((key, index) => {
                return <MenuItem item={items[key]} key={`Menuitem${key}`} />;
            })}
        </ul>
    );
}

function MenuItem(props) {
    const { item } = props;

    const fireContext = useContext(FirebaseContext);
    if (item.admin && fireContext.user.role !== 'admin') return null;
    return (
        <li className="menu-item">
            <NavLink to={item.route.path} activeClassName="active">
                <Octicon icon={item.Icon} className="icon" />
                <span className="text">{item.title}</span>
                <div className="tooltip">{item.title}</div>
            </NavLink>
        </li>
    );
}
