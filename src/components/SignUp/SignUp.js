import React from 'react';

import { FirebaseConsumer } from '../Firebase/FirebaseProvider';
import SignUpForm from './SignUpForm';

export default function SignUpPage() {
    return (
        <div>
            <h1>SignUp</h1>
            <FirebaseConsumer>
                {context => {
                    return <SignUpForm doCreateUserWithEmailAndPassword={context.doCreateUserWithEmailAndPassword} />;
                }}
            </FirebaseConsumer>
        </div>
    );
}
