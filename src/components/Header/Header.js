import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';

import './Header.css';

export default function Header(props) {
    const context = useContext(FirebaseContext);
    if (context.isLoggedIn) {
        return (
            <div className="header">
                <Link className="link" to="/account">
                    Account
                </Link>
                <span className="link" onClick={context.doSignOut}>
                    Sign Out
                </span>
            </div>
        );
    }
    return null;
}
