import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import FirebaseProvider from '../Firebase/FirebaseProvider';
import * as ROUTES from '../../constants/routes';

import SignUp from '../SignUp/SignUp';
import Login from '../Login/Login';

import './App.css';

class App extends Component {
    render() {
        return (
            <FirebaseProvider>
                <Router>
                    <div>
                        <Navigation />
                        <hr />
                        <Route exact path={ROUTES.LANDING} component={() => <div>Landing Page</div>} />
                        <Route path={ROUTES.SIGN_UP} component={SignUp} />
                        <Route path={ROUTES.LOGIN} component={Login} />
                        <Route path={ROUTES.PASSWORD_FORGET} component={() => <div>Forget Password</div>} />
                        <Route path={ROUTES.HOME} component={() => <div>Home</div>} />
                        <Route path={ROUTES.ACCOUNT} component={() => <div>Account</div>} />
                        <Route path={ROUTES.ADMIN} component={() => <div>Admin</div>} />
                    </div>
                </Router>
            </FirebaseProvider>
        );
    }
}

export default App;
