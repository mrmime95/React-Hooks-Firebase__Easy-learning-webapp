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

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <FirebaseProvider>
                <div className="app">
                    <LeftPanel menu={navigationConfig} />
                    <div className="right-panel">
                        <Header />
                        <div className="main">
                            <Root>
                                <React.Fragment>
                                    <Switch>
                                        <GuardRoute type="public" path="/login" component={Login} />
                                        <GuardRoute type="public" path="/signup" component={SignUp} />
                                        {Object.keys(navigationConfig).map((key, index) => {
                                            const route = navigationConfig[key].route;
                                            return (
                                                <GuardRoute
                                                    type="private"
                                                    path={route.path}
                                                    component={route.Component}
                                                    key={index}
                                                />
                                            );
                                        })}
                                        <Redirect from="/" to={navigationConfig.dashboard.route.path} />
                                    </Switch>
                                </React.Fragment>
                            </Root>
                        </div>
                    </div>
                </div>
            </FirebaseProvider>
        </BrowserRouter>
    );
}

export default App;
