// @flow
import React, { useContext } from 'react';

import { FriendsContext } from '../FriendsProvider/FriendsProvider';
import GridWithPagination from '../../shared/Grid/GridWithPagination/GridWithPagination';
import GridColumn from '../../shared/Grid/GridColumn/GridColumn';
import AvatarCircle from '../../shared/AvatarCircle/AvatarCircle';
import { LinkGridRow } from '../../shared/Grid/GridRow/GridRow';
import type { Match as RouterMatch } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import SearchArea from '../../shared/SearchArea/SearchArea';
import Checkbox from '../../shared/Checkbox/Checkbox';
import FormTags from '../../shared/FormTags/FormTags';
import NumberField from '../../shared/formFields/NumberField/NumberField';

import './FriendsList.css';

export default function FriendsList(props: { match: RouterMatch }) {
    const context = useContext(FriendsContext);
    const { user } = useContext(FirebaseContext);
    return (
        <div className="friends-list">
            <h3>Friends</h3>
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
                <GridWithPagination
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
                        if (rowData.id !== user.id) {
                            return (
                                <LinkGridRow
                                    linkTo={`/user/${rowData.id}`}
                                    key={`LinkGridRow${rowData.id}`}
                                    className={`${rowData.role}`}
                                >
                                    <GridColumn className="profile-picture">
                                        <AvatarCircle profilePicture={rowData.profilePicture} fullName={rowData.name} />
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
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={e => {
                                                e.preventDefault();
                                                context.deleteFriend(rowData.id);
                                            }}
                                        >
                                            Delete friend
                                        </button>
                                    </GridColumn>
                                </LinkGridRow>
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

function sortOptions() {
    return [
        { value: 'created-at_desc', label: `created at-desc` },
        { value: 'created-at_asc', label: `created at-asc` },
        { value: 'name_desc', label: `creator name-desc` },
        { value: 'name_asc', label: `creator name-asc` },
        { value: 'pack-name_desc', label: `package name-desc` },
        { value: 'pack-name_asc', label: `package name-asc` },
        { value: 'cards-number_desc', label: `cards number-desc` },
        { value: 'cards-number_asc', label: `cards number-asc` },
        { value: 'corrects-number_desc', label: `correct cards number-desc` },
        { value: 'corrects-number_asc', label: `correct cards number-asc` },
        { value: 'incorrects-number_desc', label: `incorrect cards number-desc` },
        { value: 'incorrects-number_asc', label: `incorrect cards number-asc` },
    ];
}
