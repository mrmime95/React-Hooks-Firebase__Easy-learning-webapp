// @flow
import React from 'react';

import FriendsProvider from './FriendsProvider/FriendsProvider';
import FriendsList from './FriendsList/FriendsList';

import './Friends.css';

export default function Friends(props) {
    return (
        <div className="list">
            <FriendsProvider>
                <FriendsList {...props} />
            </FriendsProvider>
        </div>
    );
}
