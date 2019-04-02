// @flow
import React, { useContext } from 'react';

import UsersProvider, { UsersContext } from './UsersProvider/UsersProvider';
import { users } from '../../dummyData/Users';
import GridWithPagination from '../shared/Grid/GridWithPagination/GridWithPagination';
import GridColumn from '../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';
import { GridRow } from '../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';

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
    const { match } = props;

    const path = match.path;

    return (
        <div className="user-list">
            <div className="grid-area">
                <GridWithPagination
                    headerConfig={[
                        { label: 'name', flex: 3 },
                        { label: 'status', flex: 1 },
                        { label: 'datas', flex: 2 },
                        { label: 'actions', flex: 2 },
                    ]}
                    createRow={(rowData: {
                        id: number,
                        name: string,
                        profilePicture?: string,
                        status: string,
                        subjects: number,
                        packages: number,
                        words: number,
                    }) => {
                        return (
                            <GridRow key={`LinkGridRow${Math.random()}`} className={`${rowData.status}`}>
                                <GridColumn className="name">
                                    <AvatarCircle profilePicture={rowData.profilePicture} fullName={rowData.name} />
                                    <p className="title">{rowData.name}</p>
                                </GridColumn>

                                <GridColumn className="status" label="status">
                                    <p>{rowData.status}</p>
                                </GridColumn>

                                <GridColumn className="datas">
                                    <GridColumn label="subjects">
                                        <p className="subjects">{rowData.subjects}</p>
                                    </GridColumn>
                                    <GridColumn label="packages">
                                        <p className="packages">{rowData.packages}</p>
                                    </GridColumn>
                                    <GridColumn label="words">
                                        <p className="words">{rowData.words}</p>
                                    </GridColumn>
                                </GridColumn>

                                <GridColumn className="buttons">
                                    <button type="button" className="btn btn-outline-primary">
                                        Primary
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary">
                                        Secondary
                                    </button>
                                    <button type="button" className="btn btn-outline-success">
                                        Success
                                    </button>
                                    <button type="button" className="btn btn-outline-danger">
                                        Danger
                                    </button>
                                </GridColumn>
                            </GridRow>
                        );
                    }}
                    data={context.filteredUsers}
                />
            </div>
        </div>
    );
}
