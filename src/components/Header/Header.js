import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import AccountInfo from './AccountInfo/AccountInfo';
import FriendRequests from '../Friends/FriendRequests/FriendRequests';

import './Header.css';

export default function Header(props) {
    const context = useContext(FirebaseContext);
    if (context.isLoggedIn) {
        return (
            <div className="header">
                <div className="friend-request-container">
                    <FriendRequests />
                </div>
                <div className="logo">
                    <AccountInfo
                        profilePicture={context.user.profilePicture}
                        fullName={context.user.firstName + ' ' + context.user.lastName}
                        email={context.user.email}
                        role={context.user.role}
                        linkTo={`/user/${context.user.id}`}
                        logOut={context.doSignOut}
                    />
                </div>
            </div>
        );
    }
    return null;
}
