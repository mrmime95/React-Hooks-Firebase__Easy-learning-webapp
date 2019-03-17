import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';

const Navigation = () => {
    const context = useContext(FirebaseContext);
    return <div>{context.isLoggedIn ? <NavigationAuth doSignOut={context.doSignOut} /> : <NavigationNonAuth />}</div>;
};

function NavigationAuth(props: { doSignOut: Function }) {
    return (
        <ul>
            <li>
                <Link to="/dashboard">Dashboard</Link>
            </li>

            <li>
                <Link to="/account">Account</Link>
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
            <Link to="/login">Login</Link>
        </li>
        <li>
            <Link to="/signup">Sign up</Link>
        </li>
    </ul>
);

export default Navigation;
