/* @flow */

import React from 'react';

import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Organization as OrganizationIcon,
    FileDirectory,
} from '@githubprimer/octicons-react';

import Dashboard from '../Dashboard/Dashboard';
import Users from '../Users/Users';
import CreateCard from '../CreateCard/CreateCard';
import Subjects from '../Subjects/Subjects';

const EmptyRouteComponent = title => props => <div>{title}</div>;

const navigationConfig = {
    dashboard: {
        title: 'Dashboard',
        route: componentRoute('/dashboard', Dashboard),
        Icon: DashboardIcon,
        home: true,
    },
    subjects: {
        title: 'Subjects',
        route: componentRoute('/subjects', Subjects),
        Icon: FileDirectory,
    },
    users: {
        title: 'Users',
        route: componentRoute('/users', Users),
        Icon: PersonIcon,
    },
    friends: {
        title: 'Friends',
        route: componentRoute('/friends', EmptyRouteComponent('Friends')),
        Icon: OrganizationIcon,
    },
    createCard: {
        title: 'Create card',
        route: componentRoute('/create-card', CreateCard),
        Icon: OrganizationIcon,
    },
};

function componentRoute(path, Component) {
    return {
        path,
        Component,
    };
}

export default navigationConfig;
