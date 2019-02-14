import React from 'react';

const SessionContext = React.createContext();
export const SessionConsumer = SessionContext.Consumer;

class SessionProvider extends React.Component {
    state = {
        authUser: null,
    };
    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        return (
            <SessionContext.Provider
                value={{
                    ...this.state,
                }}
            >
                {this.props.children}
            </SessionContext.Provider>
        );
    }
}

export default SessionProvider;
