// @flow
import React, { useContext, useState } from 'react';

import UsersProvider, { UsersContext } from './UsersProvider/UsersProvider';
import { users } from '../../dummyData/Users';
import GridWithPagination from '../shared/Grid/GridWithPagination/GridWithPagination';
import Grid from '../shared/Grid/Grid';
import GridColumn from '../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';
import { LinkGridRow } from '../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import SearchArea from '../shared/SearchArea/SearchArea';
import Checkbox from '../shared/Checkbox/Checkbox';
import FormTags from '../shared/FormTags/FormTags';
import TextField from '../shared/formFields/TextField/TextField';

import './Users.css';

export default function Users(props) {
    return (
        <div className="list">
            <UsersProvider>
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
            <h3>Users</h3>
            <SearchArea
                onSubmit={context.onSearch}
                initialValues={{
                    sort: sortOptions()[0],
                    minCards: null,
                    minPacks: null,
                    minSubjects: null,
                    admins: false,
                    approvers: false,
                    users: true,
                    tags: [],
                }}
                sort={{
                    options: sortOptions(),
                }}
                isLoading={context.isLoading}
            >
                {({ values, handleChange, handleBlur }: FilterProps<Filters>) => (
                    <div className="filters">
                        <div className="filter-line">
                            <div className="inputs">
                                <TextField
                                    label="Minimum cards number"
                                    className="number-field"
                                    name="minCards"
                                    value={values.minCards}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Minimum cards number"
                                />
                                <TextField
                                    label="Minimum packages number"
                                    className="number-field"
                                    name="minPacks"
                                    value={values.minPacks}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Minimum packages number"
                                />
                                <TextField
                                    label="Minimum subjects number"
                                    className="number-field"
                                    name="minSubjects"
                                    value={values.minSubjects}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Minimum subjects number"
                                />
                            </div>
                            <div className="checkboxes">
                                <Checkbox
                                    handleChange={e => {
                                        handleChange({
                                            target: {
                                                name: 'users',
                                                value: e.target.checked,
                                            },
                                        });
                                    }}
                                    name="users"
                                    id="users"
                                    checked={values.users}
                                    label="Show users"
                                />

                                <Checkbox
                                    handleChange={e => {
                                        handleChange({
                                            target: {
                                                name: 'approvers',
                                                value: e.target.checked,
                                            },
                                        });
                                    }}
                                    name="approvers"
                                    id="approvers"
                                    checked={values.approvers}
                                    label="Show approvers"
                                />
                                <Checkbox
                                    handleChange={e => {
                                        handleChange({
                                            target: {
                                                name: 'admins',
                                                value: e.target.checked,
                                            },
                                        });
                                    }}
                                    name="admins"
                                    id="admins"
                                    checked={values.admins}
                                    label="Show admins"
                                />
                            </div>
                        </div>
                        <div className="filer-tags">
                            <FormTags name="tags" tags={values.tags} handleChange={handleChange} />
                        </div>
                    </div>
                )}
            </SearchArea>
            <div className="grid-area">
                {context.users.length !== 0 ? (
                    <Grid
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
                                    <LinkGridRow
                                        linkTo={`/user/${rowData.id}`}
                                        key={`LinkGridRow${rowData.id}`}
                                        className={`${rowData.role}`}
                                    >
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
                                                    type="submit"
                                                    className="btn btn-outline-primary"
                                                    onClick={e => {
                                                        e.preventDefault();
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
                                                    type="submit"
                                                    className="btn btn-outline-primary"
                                                    onClick={e => {
                                                        e.preventDefault();
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
                                    </LinkGridRow>
                                );
                            }
                            return null;
                        }}
                        data={context.users}
                    />
                ) : (
                    <div>No user to show...</div>
                )}
            </div>
        </div>
    );
}

function sortOptions() {
    return [
        { value: 'name_desc', label: `name-desc` },
        { value: 'name_asc', label: `name-asc` },
        { value: 'words-number_desc', label: `words number-desc` },
        { value: 'words-number_asc', label: `words number-asc` },
        { value: 'status_desc', label: `status-desc` },
        { value: 'status_asc', label: `status-asc` },
        { value: 'packages-number_desc', label: `packages number-desc` },
        { value: 'packages-number_asc', label: `packages number-asc` },
        { value: 'subjects-number_desc', label: `subjects number-desc` },
        { value: 'subjects-number_asc', label: `subjects number-asc` },
    ];
}
