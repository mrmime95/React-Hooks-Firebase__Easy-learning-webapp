// @flow
import React, { useContext } from 'react';

import { FriendsContext } from '../FriendsProvider/FriendsProvider';
import GridWithPagination from '../../shared/Grid/GridWithPagination/GridWithPagination';
import GridColumn from '../../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../../shared/AvatarCircle/AvatarCircle';
import { GridRow } from '../../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import { Link } from 'react-router-dom';

import './FriendsList.css';

export default function FriendsList(props: { match: RouterMatch }) {
    const context = useContext(FriendsContext);
    const { user } = useContext(FirebaseContext);
    return (
        <div className="friends-list">
            <div className="grid-area">
                <h3>Friends:</h3>
                <GridWithPagination
                    headerConfig={[
                        { label: 'picture', flex: 1 },
                        { label: 'personal data', flex: 3 },
                        { label: 'status', flex: 1 },
                        { label: 'data', flex: 2 },
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
                                        <AvatarCircle profilePicture={rowData.profilePicture} fullName={rowData.name} />
                                    </GridColumn>
                                    <GridColumn className="name">
                                        <GridColumn className="name-content">
                                            <GridColumn label="Name">
                                                <Link to={`/user/${rowData.id}`}>
                                                    <p className="name-text">{rowData.name}</p>
                                                </Link>
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

                                    <GridColumn className="data">
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
                                            onClick={() => context.deleteFriend(rowData.id)}
                                        >
                                            Delete friend
                                        </button>
                                    </GridColumn>
                                </GridRow>
                            );
                        }
                        return null;
                    }}
                    data={context.friends}
                />
            </div>
        </div>
    );
}
