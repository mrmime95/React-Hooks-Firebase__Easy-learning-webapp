// @flow
import React, { useContext, useState } from 'react';

import UsersProvider, { UsersContext } from './UsersProvider/UsersProvider';
import { users } from '../../dummyData/Users';
import GridWithPagination from '../shared/Grid/GridWithPagination/GridWithPagination';
import GridColumn from '../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';
import { GridRow } from '../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import { Link } from 'react-router-dom';

import './Users.css';

export default function Users(props) {
    return (
        <div className="list">
            <UsersProvider users={users}>
                <UsersContent {...props} />
            </UsersProvider>
        </div>
    );
}

function UsersContent(props: { match: RouterMatch }) {
    const context = useContext(UsersContext);
    const { user } = useContext(FirebaseContext);
    return (
        <div className="user-list">
            <div className="grid-area">
                <h3>Users:</h3>
                {context.users.length !== 0 ? (
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
                            const [sent, setSent] = useState(rowData.requested);
                            const [deleted, setDeleted] = useState(!rowData.requested);
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
                                            {user.friends && user.friends.find(friend => friend === rowData.id) ? (
                                                <h5>Is your friend</h5>
                                            ) : rowData.requested ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        setDeleted(true);
                                                        setSent(false);
                                                        context.deleteFriendReques(rowData.id);
                                                    }}
                                                    disabled={deleted}
                                                >
                                                    Delete friend request
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        setSent(true);
                                                        setDeleted(false);
                                                        context.createFriendReques(rowData.id);
                                                    }}
                                                    disabled={sent}
                                                >
                                                    Send friend request
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <React.Fragment>
                                                    <button type="button" className="btn btn-outline-secondary">
                                                        Delete user
                                                    </button>
                                                    {rowData.role !== 'approver' && (
                                                        <button type="button" className="btn btn-outline-secondary">
                                                            Create approver
                                                        </button>
                                                    )}
                                                    {rowData.role !== 'admin' && (
                                                        <button type="button" className="btn btn-outline-secondary">
                                                            Create admin
                                                        </button>
                                                    )}
                                                    {rowData.role !== 'user' && (
                                                        <button type="button" className="btn btn-outline-secondary">
                                                            Create user
                                                        </button>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </GridColumn>
                                    </GridRow>
                                );
                            }
                            return null;
                        }}
                        data={context.users}
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}
