import React from 'react';
import { Route } from 'react-router-dom';
import './InfoTabs.css';

function InfoTabs(props: { className?: string, children: React$node }) {
    return (
        <div className="info-tabs">
            <div className={`info ${props.className && props.className}`}>{props.children}</div>
            <Tabs {...props} />
        </div>
    );
}

function Tabs(props: { location: RouterLocation, match: RouterMatch, component: Rect$Node }) {
    const { match } = props;
    const url = match.url;
    return (
        <div className="tabs">
            <div className="tab-content">
                <Route
                    path={url}
                    exact={true}
                    component={innerProps => {
                        const RouteComponent = props.component;
                        return <RouteComponent baseRoutePath={url} {...innerProps} />;
                    }}
                />
            </div>
        </div>
    );
}

export default InfoTabs;
