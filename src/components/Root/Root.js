import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';

export default function Root(props: { type: any, children: any }) {
    const { authReady } = useContext(FirebaseContext);
    if (!authReady) {
        return <div>Loading...</div>;
    }
    return props.children;
}
