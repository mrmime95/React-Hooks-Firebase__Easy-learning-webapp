import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';

export default function GuardRoute(props) {
    const { type, ...rest } = props;
    const { isLoggedIn } = useContext(FirebaseContext);
    if (type === 'private' && !isLoggedIn) {
        return <Redirect to="/login" />;
    } else if (type === 'public' && isLoggedIn) {
        return <Redirect to="/" />;
    }

    return <Route {...rest} />;
}
