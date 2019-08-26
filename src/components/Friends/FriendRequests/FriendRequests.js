// @flow
import React, { useContext, useState } from 'react';

import { FriendsContext } from '../FriendsProvider/FriendsProvider';
import Grid from '../../shared/Grid/Grid';
import GridColumn from '../../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../../shared/AvatarCircle/AvatarCircle';
import { LinkGridRow } from '../../shared/Grid/GridRow/GridRow';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import IconWithBadge from '../../shared/IconWithBadge/IconWithBadge';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import './FriendRequests.css';

export default function FriendRequests(props) {
    const { getFriendRequestNumber, requestNumber, user, requesters } = useContext(FirebaseContext);
    getFriendRequestNumber();
    const context = useContext(FriendsContext);
    const [menuIsVisible, setMenuIsVisible] = useState(false);

    return (
        <ClickedOutsideChecker onOutsideClick={hideMenu}>
            <div className="friends-requests-dropdown">
                <IconWithBadge className="frined-requests" badgeValue={requestNumber}>
                    <button type="button" className="opener" onClick={toggle}>
                        <i className="fas fa-user-plus icon" />
                    </button>
                </IconWithBadge>
                <div className={'dropdown ' + (menuIsVisible ? 'show' : 'hide')}>
                    <div className="friend-requests-list">
                        <div className="grid-area">
                            <h2 className="dropdown-title">Friend requests:</h2>
                            {requesters.length ? (
                                <Grid
                                    createRow={(rowData: {
                                        id: number,
                                        name: string,
                                        profilePicture?: string,
                                        email: string,
                                        birthDate: string,
                                        status: string,
                                        subjects: number,
                                        packages: number,
                                        words: number,
                                        requested: boolean,
                                    }) => {
                                        if (rowData.id !== user.id) {
                                            return (
                                                <div className="friend-request-row" onClick={toggle}>
                                                    <LinkGridRow
                                                        linkTo={`/user/${rowData.id}`}
                                                        key={`LinkGridRow${rowData.id}`}
                                                        className={`${rowData.role}`}
                                                    >
                                                        <GridColumn className="profile-column">
                                                            <GridColumn className="profile-picture">
                                                                <AvatarCircle
                                                                    profilePicture={rowData.profilePicture}
                                                                    fullName={rowData.name}
                                                                />
                                                            </GridColumn>
                                                            <GridColumn className="user">
                                                                <GridColumn>
                                                                    <p className="user-name-text">{rowData.name}</p>
                                                                </GridColumn>
                                                                <GridColumn>
                                                                    <p className="user-email">{rowData.email}</p>
                                                                </GridColumn>
                                                            </GridColumn>
                                                        </GridColumn>
                                                        <GridColumn className="buttons-column">
                                                            <div className="buttons">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        context.acceptFriend(rowData.id);
                                                                    }}
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-dark"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        context.deleteFriendReques(rowData.id);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </GridColumn>
                                                    </LinkGridRow>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    data={requesters}
                                />
                            ) : (
                                <div>0 friend request</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ClickedOutsideChecker>
    );
    function toggle() {
        setMenuIsVisible(!menuIsVisible);
    }

    function hideMenu() {
        setMenuIsVisible(false);
    }
}
