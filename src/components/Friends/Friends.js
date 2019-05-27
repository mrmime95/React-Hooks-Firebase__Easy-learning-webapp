// @flow
import React, { useContext } from 'react';

import FriendsProvider, { FriendsContext } from './FriendsProvider/FriendsProvider';
import { users } from '../../dummyData/Users';
import GridWithPagination from '../shared/Grid/GridWithPagination/GridWithPagination';
import GridColumn from '../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';
import { GridRow } from '../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import FriendsList from './FriendsList/FriendsList';

import './Friends.css';

export default function Friends(props) {
    return (
        <div className="list">
            <FriendsProvider users={users}>
                <FriendRequestsContent {...props} />
            </FriendsProvider>
        </div>
    );
}

function FriendRequestsContent(props: { match: RouterMatch }) {
    const context = useContext(FriendsContext);
    const { user } = useContext(FirebaseContext);
    const { match } = props;
    const path = match.path;

    if (context.recuesters.length)
        return (
            <div className="friend-requests-list">
                <div className="grid-area">
                    <h3>Friend requests:</h3>
                    <GridWithPagination
                        headerConfig={[
                            { label: 'picture', flex: 1 },
                            { label: 'personal data', flex: 3 },
                            { label: 'status', flex: 1 },
                            { label: 'datas', flex: 2 },
                            { label: 'actions', flex: 2 },
                        ]}
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
                                    <GridRow key={`LinkGridRow${rowData.id}`} className={`${rowData.role}`}>
                                        <GridColumn className="profile-picture">
                                            <AvatarCircle
                                                profilePicture={rowData.profilePicture}
                                                fullName={rowData.name}
                                            />
                                        </GridColumn>
                                        <GridColumn className="name">
                                            <GridColumn className="name-content">
                                                <GridColumn label="Name">
                                                    <p className="name-text">{rowData.name}</p>
                                                </GridColumn>
                                                <GridColumn label="E-mail">
                                                    <p className="email">{rowData.email}</p>
                                                </GridColumn>
                                                <GridColumn label="Birth">
                                                    <p className="birth">{rowData.birthDate}</p>
                                                </GridColumn>
                                            </GridColumn>
                                        </GridColumn>

                                        <GridColumn className="status" label="status">
                                            <p>{rowData.role}</p>
                                        </GridColumn>

                                        <GridColumn className="datas">
                                            <GridColumn label="subjects">
                                                <p className="subjects">{rowData.subjects}</p>
                                            </GridColumn>
                                            <GridColumn label="packages">
                                                <p className="packages">{rowData.packages}</p>
                                            </GridColumn>
                                            <GridColumn label="words">
                                                <p className="words">{rowData.cards}</p>
                                            </GridColumn>
                                        </GridColumn>
                                        <GridColumn className="buttons">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={() => context.acceptFriend(rowData.id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={() => context.deleteFriendReques(rowData.id)}
                                            >
                                                Decide
                                            </button>
                                        </GridColumn>
                                    </GridRow>
                                );
                            }
                            return null;
                        }}
                        data={context.recuesters}
                    />
                </div>
            </div>
        );
    return null;
}
