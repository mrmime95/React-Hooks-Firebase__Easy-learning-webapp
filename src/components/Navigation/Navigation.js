import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { FirebaseConsumer } from '../Firebase/FirebaseProvider';

const Navigation = () => (
    <div>
        <FirebaseConsumer>
            {context => {
                console.log('====================================');
                console.log(context.userIn);
                console.log('====================================');
                return context.userIn ? <NavigationAuth doSignOut={context.doSignOut} /> : <NavigationNonAuth />;
            }}
        </FirebaseConsumer>
    </div>
);

function NavigationAuth(props: { doSignOut: Function }) {
    return (
        <ul>
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
            <li>
                <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
            <li>
                <Link to={ROUTES.ADMIN}>Admin</Link>
            </li>
            <li>
                <button type="button" onClick={props.doSignOut}>
                    Sign Out
                </button>
            </li>
        </ul>
    );
}

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.LOGIN}>Login</Link>
        </li>
    </ul>
);

export default Navigation;
