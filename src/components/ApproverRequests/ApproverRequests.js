// @flow
import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import Grid from '../shared/Grid/Grid';
import GridColumn from '../shared/Grid/GridColumn/GridColumn';
import FormTags from '../shared/FormTags/FormTags';
import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';
import { LinkGridRow } from '../shared/Grid/GridRow/GridRow';

import './ApproverRequests.css';

export default function ApproverRequests(props) {
    const { getNewApproverRequests, db, approvingApproverRequest, declideApproverRequest } = useContext(
        FirebaseContext
    );
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        getRequests();
    }, []);

    return (
        <div className="approver-requests">
            <div className="grid-area">
                {requests.length !== 0 ? (
                    <Grid
                        headerConfig={[
                            { label: 'picture', flex: 1 },
                            { label: 'personal data', flex: 3 },
                            { label: 'also approver at', flex: 2 },
                            { label: 'new tags', flex: 2 },
                            { label: 'actions', flex: 2 },
                        ]}
                        createRow={(rowData: {
                            id: string,
                            email: string,
                            firstName: string,
                            lastName: string,
                            role: string,
                            profilePicture: string,
                            tags: string[],
                            approverAt: string[],
                        }) => {
                            return (
                                <LinkGridRow
                                    linkTo={`/user/${rowData.id}`}
                                    key={`LinkGridRow${rowData.id}`}
                                    className={`${rowData.role}`}
                                >
                                    <GridColumn className="profile-picture">
                                        <AvatarCircle
                                            profilePicture={rowData.profilePicture}
                                            fullName={rowData.firstName + ' ' + rowData.lastName}
                                        />
                                    </GridColumn>
                                    <GridColumn className="name">
                                        <GridColumn className="name-content">
                                            <GridColumn label="Name">
                                                <p className="name-text">
                                                    {rowData.firstName + ' ' + rowData.lastName}
                                                </p>
                                            </GridColumn>
                                            <GridColumn label="E-mail">
                                                <p className="email">{rowData.email}</p>
                                            </GridColumn>
                                            <GridColumn label="status">
                                                <p>{rowData.role}</p>
                                            </GridColumn>
                                        </GridColumn>
                                    </GridColumn>

                                    <GridColumn className="tags" label="tags">
                                        {rowData.approverAt.map(tag => {
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

                                    <GridColumn className="buttons-column">
                                        <div className="buttons">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-secondary"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    approvingApproverRequest(
                                                        rowData.id,
                                                        rowData.userId,
                                                        rowData.tags,
                                                        rowData.approverAt
                                                    );
                                                    setTimeout(() => {
                                                        getRequests();
                                                    }, 500);
                                                }}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm  btn-outline-dark"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    declideApproverRequest(
                                                        rowData.id,
                                                        rowData.userId,
                                                        rowData.tags,
                                                        rowData.approverAt
                                                    );
                                                    setTimeout(() => {
                                                        getRequests();
                                                    }, 500);
                                                }}
                                            >
                                                Declide
                                            </button>
                                        </div>
                                    </GridColumn>
                                    <div className="created-at">
                                        <span>{rowData.createdAt}</span>
                                    </div>
                                </LinkGridRow>
                            );
                        }}
                        data={requests}
                    />
                ) : (
                    <div>0 request</div>
                )}
            </div>
        </div>
    );

    function getRequests() {
        getNewApproverRequests()
            .then(resp =>
                Promise.all(
                    resp.docs.map(async request => {
                        const user = await db.doc(`users/${request.data().userId}`).get();
                        return { ...user.data(), ...request.data(), id: request.id };
                    })
                )
            )
            .then(resp => {
                setRequests(resp);
            });
    }
}
