// @flow strict
import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/FirebaseProvider';
export const UserDetailContext = React.createContext();

function UserDetailProvider(props: { children: React$Node }) {
    const [state, setState] = useState({});
    const fireContext = useContext(FirebaseContext);
    return (
        <UserDetailContext.Provider
            value={{
                ...state,
            }}
        >
            {props.children}
        </UserDetailContext.Provider>
    );
}

export default UserDetailProvider;
