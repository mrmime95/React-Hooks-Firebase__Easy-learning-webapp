import React, { useState } from 'react';
import AvatarCircle from '../../shared/AvatarCircle/AvatarCircle';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import { Link } from 'react-router-dom';
import './AccountInfo.css';

const AccountInfo = React.forwardRef(
    (
        props: {
            fullName: string,
            email: string,
            role: string,
            linkTo: string,
            logOut: () => void,
        },
        ref
    ) => {
        const [menuIsVisible, setMenuIsVisible] = useState(false);
        return (
            <ClickedOutsideChecker onOutsideClick={hideMenu}>
                <div className="account-settings" ref={ref}>
                    <AvatarCircle fullName={props.fullName} onClick={toggle} profilePicture={props.profilePicture} />
                    <div className={'account-menu ' + (menuIsVisible ? 'show' : 'hide')}>
                        <h2 className="title">{props.fullName}</h2>
                        <small className="email">{props.email}</small>
                        <p className="role">Role: {props.role}</p>
                        <ul className="settings">
                            <Link to={props.linkTo}>
                                <li onClick={hideMenu} className="button">
                                    Profile
                                </li>
                            </Link>
                            <li className="button" onClick={props.logOut}>
                                <span>Log out</span>
                            </li>
                        </ul>
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
);

export default AccountInfo;
