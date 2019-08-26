/* @flow */

import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Organization as OrganizationIcon,
    FileDirectory,
    Play,
    Checklist,
} from '@githubprimer/octicons-react';

import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Users/Users';
import FriendsList from './components/Friends/FriendsList/FriendsList';
import Subjects from './components/Subjects/Subjects';
import Game from './components/Game/Game';
import ApproverRequests from './components/ApproverRequests/ApproverRequests';

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
        route: componentRoute('/friends', FriendsList),
        Icon: OrganizationIcon,
        withBadge: true,
    },
    playAndLearn: {
        title: 'Play and learn',
        route: componentRoute('/play-and-learn', Game),
        Icon: Play,
    },
    approverRequests: {
        title: 'Approver requests',
        route: componentRoute('/approver-requests', ApproverRequests),
        Icon: Checklist,
        admin: true,
    },
};

function componentRoute(path, Component) {
    return {
        path,
        Component,
    };
}

export default navigationConfig;
