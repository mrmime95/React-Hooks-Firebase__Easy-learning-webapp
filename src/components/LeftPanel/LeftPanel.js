import React, { useState, useContext } from 'react';
import Octicon, { ThreeBars, ArrowLeft } from '@githubprimer/octicons-react';
import { Link } from 'react-router-dom';
import Menu from './Menu/Menu';
import { FirebaseContext } from '../Firebase/FirebaseProvider';

import './LeftPanel.css';

function LeftPanel(props) {
    const [open, setOpen] = useState(false);
    const context = useContext(FirebaseContext);

    if (context.isLoggedIn) {
        return (
            <div className={'left-panel' + (open ? ' open' : '')}>
                <button className={'menu-button' + (open ? ' open' : '')} onClick={toggle}>
                    <Octicon icon={ArrowLeft} className="icon rotate-90-mobile" />
                </button>
                <button className={'menu-button' + (open ? '' : ' open')} onClick={toggle}>
                    <Octicon icon={ThreeBars} className="icon " />
                </button>

                <div className="logo">
                    <Link to="/">
                        <i className="logo-img">SDA</i>
                    </Link>
                </div>
                <Menu items={props.menu} className="menu-main" />
            </div>
        );
    }
    return null;

    function toggle() {
        setOpen(!open);
    }
}

export default LeftPanel;
