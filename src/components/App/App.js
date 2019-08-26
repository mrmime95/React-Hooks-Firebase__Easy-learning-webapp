import React from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import FirebaseProvider from '../Firebase/FirebaseProvider';
import GuardRoute from '../GuardRoute/GuardRoute';
import Root from '../Root/Root';
import navigationConfig from '../../navigationConfig';
import LeftPanel from '../LeftPanel/LeftPanel';
import Header from '../Header/Header';

import SignUp from '../SignUp/SignUp';
import Login from '../Login/Login';
import UserDetail from '../UserDetail/UserDetail';
import FriendsProvider from '../Friends/FriendsProvider/FriendsProvider';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <FirebaseProvider>
                <Root>
                    <Switch>
                        <GuardRoute type="public" path="/login" component={Login} />
                        <GuardRoute type="public" path="/signup" component={SignUp} />
                        <GuardRoute
                            type="private"
                            path="/"
                            component={() => (
                                <FriendsProvider>
                                    <div className="app">
                                        <LeftPanel menu={navigationConfig} />
                                        <div className="right-panel">
                                            <Header />
                                            <div className="main">
                                                <React.Fragment>
                                                    <Switch>
                                                        {Object.keys(navigationConfig).map((key, index) => {
                                                            const route = navigationConfig[key].route;
                                                            return (
                                                                <GuardRoute
                                                                    type="private"
                                                                    path={route.path}
                                                                    component={route.Component}
                                                                    key={index}
                                                                    admin={navigationConfig[key].admin}
                                                                />
                                                            );
                                                        })}
                                                        <GuardRoute
                                                            type="private"
                                                            path="/user/:id"
                                                            component={UserDetail}
                                                        />
                                                        <Redirect from="/" to={navigationConfig.dashboard.route.path} />
                                                    </Switch>
                                                </React.Fragment>
                                            </div>
                                        </div>
                                    </div>
                                </FriendsProvider>
                            )}
                        />
                    </Switch>
                </Root>
            </FirebaseProvider>
        </BrowserRouter>
    );
}

export default App;
