// @flow strict
import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../../Firebase/FirebaseProvider';
export const CurrentUserDetailContext = React.createContext();

function CurrentUserDetailProvider(props: { children: React$Node }) {
    const [state, setState] = useState({});
    const fireContext = useContext(FirebaseContext);
    return (
        <CurrentUserDetailContext.Provider
            value={{
                ...state,
            }}
        >
            {props.children}
        </CurrentUserDetailContext.Provider>
    );
}

export default CurrentUserDetailProvider;
