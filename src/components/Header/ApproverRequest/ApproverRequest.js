// @flow
import React, { useContext, useState } from 'react';

import Grid from '../../shared/Grid/Grid';
import GridColumn from '../../shared/Grid/GridColumn/GridColumn';
import { GridRow } from '../../shared/Grid/GridRow/GridRow';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
import IconWithBadge from '../../shared/IconWithBadge/IconWithBadge';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import FormTags from '../../shared/FormTags/FormTags';
import './ApproverRequest.css';

export default function ApproverRequest(props) {
    const { getMyApprooverRequests, setApprooverRequestToSeen } = useContext(FirebaseContext);
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const [requests, setRequests] = useState([]);
    const [requestNumber, setRequestNumber] = useState([]);
    useState(() => {
        getMyApprooverRequests().then(resp => {
            let localRequestNumber = 0;
            setRequests(
                resp.docs
                    .map(doc => {
                        if (doc.data().approved !== 'seen' && doc.data().approved !== 'requested') {
                            ++localRequestNumber;
                        }
                        return { ...doc.data(), id: doc.id };
                    })
                    .filter(doc => doc.approved !== 'seen')
            );
            setRequestNumber(localRequestNumber);
        });
    }, []);
    return (
        <ClickedOutsideChecker onOutsideClick={hideMenu}>
            <div className="approver-requests-dropdown">
                <IconWithBadge className="frined-requests" badgeValue={requestNumber}>
                    <button type="button" className="opener" onClick={toggle}>
                        <i className="fas fa-tasks"></i>
                    </button>
                </IconWithBadge>
                <div className={'dropdown ' + (menuIsVisible ? 'show' : 'hide')}>
                    <div className="approver-requests-list">
                        <div className="grid-area">
                            <h2 className="dropdown-title">Apprower requests:</h2>
                            {requests.length ? (
                                <Grid
                                    createRow={(rowData: { approved: string, createdAt: string, tags: string[] }) => {
                                        const approved =
                                            rowData.approved === 'yes'
                                                ? 'approved'
                                                : rowData.approved === 'no'
                                                ? 'not approved'
                                                : rowData.approved === 'requested'
                                                ? rowData.approved
                                                : 'seen';
                                        return (
                                            <div
                                                className="approver-request-row"
                                                key={`LinkGridRow${rowData.createdAt}`}
                                                onClick={toggle}
                                            >
                                                <GridRow className={`${rowData.role}`}>
                                                    <GridColumn className="info-column">
                                                        <GridColumn className="info-description">
                                                            <GridColumn>
                                                                <p className="approved-text">{approved}</p>
                                                            </GridColumn>
                                                            <GridColumn>
                                                                <p className="approver-request-created-at">
                                                                    {rowData.createdAt}
                                                                </p>
                                                            </GridColumn>
                                                        </GridColumn>
                                                    </GridColumn>
                                                    <GridColumn className="tags-column" label="tags">
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
                                                        {approved !== 'requested' && (
                                                            <div className="buttons">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-secondary"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        setApprooverRequestToSeen(rowData.id);
                                                                        setRequests(
                                                                            requests.filter(
                                                                                doc => rowData.id !== doc.id
                                                                            )
                                                                        );
                                                                        setRequestNumber(requestNumber - 1);
                                                                    }}
                                                                >
                                                                    Seen
                                                                </button>
                                                            </div>
                                                        )}
                                                    </GridColumn>
                                                </GridRow>
                                            </div>
                                        );
                                    }}
                                    data={requests}
                                />
                            ) : (
                                <div>You didn't send approver requests</div>
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
