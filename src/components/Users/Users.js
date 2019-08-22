// @flow
import React, { useContext, useState } from 'react';

import UsersProvider, { UsersContext } from './UsersProvider/UsersProvider';
import Grid from '../shared/Grid/Grid';
import GridColumn from '../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';
import { LinkGridRow } from '../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import SearchArea from '../shared/SearchArea/SearchArea';
import Checkbox from '../shared/Checkbox/Checkbox';
import FormTags from '../shared/FormTags/FormTags';
import NumberField from '../shared/formFields/NumberField/NumberField';

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
                    minCards: 0,
                    minPacks: 0,
                    minSubjects: 0,
                    admins: true,
                    approvers: true,
                    users: true,
                    tags: [],
                }}
                sort={{
                    options: sortOptions(),
                }}
            >
                {({ values, handleChange, handleBlur }: FilterProps<Filters>) => (
                    <div className="filters">
                        <div className="filter-line">
                            <div className="inputs">
                                <NumberField
                                    name="minCards"
                                    value={values.minCards}
                                    maxValue={100}
                                    minValue={0}
                                    label="Minimum cards number"
                                    handleChange={handleChange}
                                    placeholder="Minimum cards number"
                                />
                                <NumberField
                                    name="minPacks"
                                    value={values.minPacks}
                                    maxValue={100}
                                    minValue={0}
                                    label="Minimum packages number"
                                    handleChange={handleChange}
                                    placeholder="Minimum packages number"
                                />
                                <NumberField
                                    name="minSubjects"
                                    value={values.minSubjects}
                                    maxValue={100}
                                    minValue={0}
                                    label="Minimum subjects number"
                                    placeholder="Minimum subjects number"
                                    handleChange={handleChange}
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
                            { label: 'tags', flex: 2 },
                            { label: 'data', flex: 2 },
                            { label: 'actions', flex: 2 },
                        ]}
                        createRow={(rowData: {
                            id: string,
                            email: string,
                            name: string,
                            birthDate: string,
                            subjects: number,
                            packages: number,
                            cards: number,
                            role: string,
                            profilePicture: string,
                            tags: string[],
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
                                                <GridColumn label="status">
                                                    <p>{rowData.role}</p>
                                                </GridColumn>
                                            </GridColumn>
                                        </GridColumn>

                                        <GridColumn className="tags" label="tags">
                                            {rowData.tags.map(tag => {
                                                return (
                                                    <FormTags
                                                        key={tag}
                                                        name="tags"
                                                        tags={[{ id: tag, text: tag }]}
                                                        handleChange={() => {}}
                                                        readOnly
                                                    />
                                                );
                                            })}
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
                                                <Checkbox
                                                    handleChange={() => {}}
                                                    name="approvers"
                                                    id="approvers"
                                                    checked={true}
                                                    label="Friend"
                                                    readOnly
                                                />
                                            ) : (
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-outline-success dropdown-toggle"
                                                        type="button"
                                                        id="dropdownMenuLink"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                        }}
                                                    >
                                                        {rowData.requested ? 'Friend request sent' : 'Friend request'}
                                                    </button>

                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                        {rowData.requested ? (
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
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
                                                                type="button"
                                                                className="dropdown-item"
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
                                                    </div>
                                                </div>
                                            )}
                                            {user.role === 'admin' && (
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-outline-danger dropdown-toggle"
                                                        type="button"
                                                        id="dropdownMenuLink"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                        }}
                                                    >
                                                        Admin actions
                                                    </button>

                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                        <button
                                                            type="button"
                                                            className="dropdown-item"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                            }}
                                                        >
                                                            Delete user
                                                        </button>
                                                        {rowData.role !== 'approver' && (
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    context.updateToApprover(rowData.id);
                                                                }}
                                                            >
                                                                Change status to APPROVER
                                                            </button>
                                                        )}
                                                        {rowData.role !== 'admin' && (
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    context.updateToAdmin(rowData.id);
                                                                }}
                                                            >
                                                                Change status to ADMIN
                                                            </button>
                                                        )}
                                                        {rowData.role !== 'user' && (
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    context.updateToUser(rowData.id);
                                                                }}
                                                            >
                                                                Change status to USER
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
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
