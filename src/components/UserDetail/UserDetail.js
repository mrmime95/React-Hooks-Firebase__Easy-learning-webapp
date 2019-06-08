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

import InfoTabs from '../shared/InfoTabs/InfoTabs';
import InfoBlock from '../shared/InfoBlock/InfoBlock';

import './CurrentUserDetailsInfo.css';

function UserDetail(props: { match: RouterMatch }) {
    const fireContext = useContext(FirebaseContext);
    if (fireContext.user.id === props.match.params.id) {
        return (
            <CurrentUserDetailProvider>
                <InfoTabs className="current-user-details" component={CurrentUserSettings} {...props}>
                    <CurrentUserDetailsInfo />
                </InfoTabs>
            </CurrentUserDetailProvider>
        );
    }
    return (
        <CustomUserDetailProvider userId={props.match.params.id}>
            <InfoTabs className="custom-user-details" component={CustomUserDashboard} {...props}>
                <CustomUserDetailsInfo />
            </InfoTabs>
        </CustomUserDetailProvider>
    );
}

function CurrentUserDetailsInfo() {
    const fireContext = useContext(FirebaseContext);
    return (
        <div className="current-user-details-info">
            <InfoBlock className="name" title={fireContext.user.firstName + ' ' + fireContext.user.lastName}>
                <AvatarCircle
                    fullName={fireContext.user.firstName + ' ' + fireContext.user.lastName}
                    profilePicture={fireContext.user.profilePictureURL}
                />
                <div className="connections">
                    <p className="label">Role</p>
                    <div className="values">
                        <p className="value">{fireContext.user.role}</p>
                    </div>
                </div>
                <div className="connections">
                    <p className="label">Email</p>
                    <div className="values">
                        <p className="value">{fireContext.user.email}</p>
                    </div>
                </div>
                <div className="connections">
                    <p className="label">Friends number</p>
                    <div className="values">
                        <p className="value">{fireContext.user.friendCounter}</p>
                    </div>
                </div>
                <div className="connections">
                    <p className="label">Subjects number</p>
                    <div className="values">
                        <p className="value">{fireContext.user.subjectsNumber}</p>
                    </div>
                </div>
                <div className="connections">
                    <p className="label">Packages number</p>
                    <div className="values">
                        <p className="value">{fireContext.user.packagesNumber}</p>
                    </div>
                </div>
                <div className="connections">
                    <p className="label">Cards number</p>
                    <div className="values">
                        <p className="value">{fireContext.user.cardsNumber}</p>
                    </div>
                </div>
            </InfoBlock>
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
                            profilePicture={context.customUser.profilePictureURL}
                        />
                        <div className="connections">
                            <p className="label">Role</p>
                            <div className="values">
                                <p className="value">{context.customUser.role}</p>
                            </div>
                        </div>
                        <div className="connections">
                            <p className="label">Email</p>
                            <div className="values">
                                <p className="value">{context.customUser.email}</p>
                            </div>
                        </div>
                        <div className="connections">
                            <p className="label">Friends number</p>
                            <div className="values">
                                <p className="value">{context.customUser.friendCounter}</p>
                            </div>
                        </div>
                        <div className="connections">
                            <p className="label">Subjects number</p>
                            <div className="values">
                                <p className="value">{context.customUser.subjectsNumber}</p>
                            </div>
                        </div>
                        <div className="connections">
                            <p className="label">Packages number</p>
                            <div className="values">
                                <p className="value">{context.customUser.packagesNumber}</p>
                            </div>
                        </div>
                        <div className="connections">
                            <p className="label">Cards number</p>
                            <div className="values">
                                <p className="value">{context.customUser.cardsNumber}</p>
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
