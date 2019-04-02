import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import NewSharedPackagev from '../shared/NewSharedPackage/NewSharedPackage';
import { dashboardFlow } from '../../dummyData/dashboardFlow';
import './Dashboard.css';

export default function Dashboard(props) {
    const context = useContext(FirebaseContext);

    return (
        <div className="dashboard">
            <h3>{context.user && context.user.email}</h3>
            {dashboardFlow.map((element, index) => {
                return (
                    <NewSharedPackagev
                        user={element.user}
                        package={element.package}
                        key={`NewSharedPackagev${index}`}
                    />
                );
            })}
        </div>
    );
}
