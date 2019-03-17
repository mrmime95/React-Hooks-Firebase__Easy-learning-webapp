/* @flow */

import React from 'react';

import {
    Dashboard as DashboardIcon,
    Checklist as ChecklistIcon,
    Person as PersonIcon,
    Briefcase as BriefcaseIcon,
} from '@githubprimer/octicons-react';

import Dashboard from '../Dashboard/Dashboard';

const EmptyRouteComponent = title => props => <div>{title}</div>;

const navigationConfig = {
    dashboard: {
        title: 'Dashboard',
        route: componentRoute('/dashboard', Dashboard),
        Icon: DashboardIcon,
        home: true,
    },
    processes: {
        title: 'Processes',
        route: componentRoute('/processes', EmptyRouteComponent('Processes')),
        Icon: ChecklistIcon,
    },
    users: {
        title: 'Acoounts',
        route: componentRoute('/account', EmptyRouteComponent('My Account')),
        Icon: PersonIcon,
    },
    clients: {
        title: 'Clients',
        route: componentRoute('/clients', EmptyRouteComponent('Clients')),
        Icon: BriefcaseIcon,
    },
};

function componentRoute(path, Component) {
    return {
        path,
        Component,
    };
}

export default navigationConfig;
