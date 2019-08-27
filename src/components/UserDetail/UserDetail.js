// @flow

import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import CurrentUserDetailProvider, {
    CurrentUserDetailContext,
} from './CurrentUser/CurrentUserDetailProvider/CurrentUserDetailProvider';
import CurrentUserSettings from './CurrentUser/CurrentUserSettings/CurrentUserSettings';

import CustomUserDetailProvider, {
    CustomUserDetailContext,
} from './CustomUser/CustomUserDetailProvider/CustomUserDetailProvider';
import CustomUserDashboard from './CustomUser/CustomUserDashboard/CustomUserDashboard';

import AvatarCircle from '../shared/AvatarCircle/AvatarCircle';

import InfoBlock from '../shared/InfoBlock/InfoBlock';
import FormTags from '../shared/FormTags/FormTags';

import './UserDetail.css';

function UserDetail(props: { match: RouterMatch }) {
    const fireContext = useContext(FirebaseContext);
    if (fireContext.user.id === props.match.params.id) {
        return (
            <CurrentUserDetailProvider>
                <div className="current-user-container">
                    <div className="info current-user-details">
                        <CurrentUserDetailsInfo />
                    </div>
                    <div className="tabs">
                        <div className="tab-content">
                            <CurrentUserSettings></CurrentUserSettings>
                        </div>
                    </div>
                </div>
            </CurrentUserDetailProvider>
        );
    }
    return (
        <CustomUserDetailProvider loadSize={5} userId={props.match.params.id} orderBy={['createdBy.createdAt', 'desc']}>
            <div className="custom-user-container">
                <div className="info custom-user-details">
                    <CustomUserDetailsInfo />
                </div>
                <div className="tabs">
                    <div className="tab-content">
                        <CustomUserDashboard></CustomUserDashboard>
                    </div>
                </div>
            </div>
        </CustomUserDetailProvider>
    );
}

function CurrentUserDetailsInfo() {
    const context = useContext(CurrentUserDetailContext);
    return (
        <div className="current-user-details-info">
            {!context.loading ? (
                <InfoBlock className="name" title={context.user.firstName + ' ' + context.user.lastName}>
                    <AvatarCircle
                        fullName={context.user.firstName + ' ' + context.user.lastName}
                        profilePicture={context.user.profilePicture}
                    />
                    <div className="connections just-number">
                        <p className="label">Friends number</p>
                        <div className="values">
                            <p className="value">{context.user.friendCounter}</p>
                        </div>
                    </div>
                    <div className="connections just-number">
                        <p className="label">Subjects number</p>
                        <div className="values">
                            <p className="value">{context.user.subjectsNumber}</p>
                        </div>
                    </div>
                    <div className="connections just-number">
                        <p className="label">Packages number</p>
                        <div className="values">
                            <p className="value">{context.user.packagesNumber}</p>
                        </div>
                    </div>
                    <div className="connections just-number">
                        <p className="label">Cards number</p>
                        <div className="values">
                            <p className="value">{context.user.cardsNumber}</p>
                        </div>
                    </div>
                    <div className="connections">
                        <p className="label">Email</p>
                        <div className="values">
                            <p className="value">{context.user.email}</p>
                        </div>
                    </div>
                    {context.user.birthday && (
                        <div className="connections">
                            <p className="label">birthday</p>
                            <div className="values">
                                <p className="value">{context.user.birthday}</p>
                            </div>
                        </div>
                    )}
                    {context.user.tags.length !== 0 && (
                        <div className="connections">
                            <p className="label">Strengths:</p>
                            <div className="values tag-values">
                                {context.user.tags.map(tag => {
                                    return (
                                        <FormTags
                                            key={'strengths' + tag}
                                            name="tags"
                                            tags={[{ id: tag, text: tag }]}
                                            handleChange={() => {}}
                                            readOnly
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="connections">
                        <p className="label">Approver at:</p>
                        <div className="values tag-values">
                            {context.user.approverAt.map(tag => {
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
                        </div>
                    </div>
                </InfoBlock>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

function CustomUserDetailsInfo() {
    const context = useContext(CustomUserDetailContext);
    return (
        <div className="custom-user-details-info">
            {!context.loading ? (
                context.customUser ? (
                    <InfoBlock
                        className="name"
                        title={context.customUser.firstName + ' ' + context.customUser.lastName}
                    >
                        <AvatarCircle
                            fullName={context.customUser.firstName + ' ' + context.customUser.lastName}
                            profilePicture={context.customUser.profilePicture}
                        />
                        <div className="connections just-number">
                            <p className="label">Friends number</p>
                            <div className="values">
                                <p className="value">{context.customUser.friendCounter}</p>
                            </div>
                        </div>
                        <div className="connections just-number">
                            <p className="label">Subjects number</p>
                            <div className="values">
                                <p className="value">{context.customUser.subjectsNumber}</p>
                            </div>
                        </div>
                        <div className="connections just-number">
                            <p className="label">Packages number</p>
                            <div className="values">
                                <p className="value">{context.customUser.packagesNumber}</p>
                            </div>
                        </div>
                        <div className="connections just-number">
                            <p className="label">Cards number</p>
                            <div className="values">
                                <p className="value">{context.customUser.cardsNumber}</p>
                            </div>
                        </div>
                        <div className="connections">
                            <p className="label">Email</p>
                            <div className="values">
                                <p className="value">{context.customUser.email}</p>
                            </div>
                        </div>
                        {context.customUser.birthday && (
                            <div className="connections">
                                <p className="label">birthday</p>
                                <div className="values">
                                    <p className="value">{context.customUser.birthday}</p>
                                </div>
                            </div>
                        )}
                        {context.customUser.tags.length !== 0 && (
                            <div className="connections">
                                <p className="label">Strengths:</p>
                                <div className="values tag-values">
                                    {context.customUser.tags.map(tag => {
                                        return (
                                            <FormTags
                                                key={'strengths' + tag}
                                                name="tags"
                                                tags={[{ id: tag, text: tag }]}
                                                handleChange={() => {}}
                                                readOnly
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="connections">
                            <p className="label">Approver at:</p>
                            <div className="values tag-values">
                                {context.customUser.approverAt.map(tag => {
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
                            </div>
                        </div>
                    </InfoBlock>
                ) : (
                    <div>This is a bad url</div>
                )
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default UserDetail;
