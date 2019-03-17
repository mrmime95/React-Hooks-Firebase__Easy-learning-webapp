import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
export default function Dashboard(props) {
    const context = useContext(FirebaseContext);
    console.log('====================================');
    console.log(context);
    console.log('====================================');
    return <h3>{context.user && context.user.email}</h3>;
}
