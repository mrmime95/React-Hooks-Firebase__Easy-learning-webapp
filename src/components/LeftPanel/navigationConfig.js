/* @flow */

import React from 'react';

import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Organization as OrganizationIcon,
    FileDirectory,
    Play,
} from '@githubprimer/octicons-react';

import Dashboard from '../Dashboard/Dashboard';
import Users from '../Users/Users';
import Subjects from '../Subjects/Subjects';
import Game from '../Game/Game';

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
        withBadge: true,
    },
    playAndLearn: {
        title: 'Play and learn',
        route: componentRoute('/play-and-learn', Game),
        Icon: Play,
    },
};

function componentRoute(path, Component) {
    return {
        path,
        Component,
    };
}

export default navigationConfig;
