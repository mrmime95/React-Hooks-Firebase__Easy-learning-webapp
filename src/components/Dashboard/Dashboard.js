import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import NewSharedPackage from '../shared/NewSharedPackage/NewSharedPackage';
import { dashboardFlow } from '../../dummyData/dashboardFlow';
import DashboardProvider, { DashboardContext } from './DashboardProvider/DashboardProvider';
import InfiniteScroll from 'react-infinite-scroller';

import './Dashboard.css';

export default function Dashboard(props) {
    return (
        <DashboardProvider loadSize={2}>
            <DashboardContainer {...props} />
        </DashboardProvider>
    );
}

function DashboardContainer(props) {
    const context = useContext(DashboardContext);
    return (
        <div className="dashboard">
            <InfiniteScroll
                pageStart={0}
                loadMore={context.getNextPackages}
                hasMore={context.hasMore}
                loader={
                    <div className="loader" key={0}>
                        Loading ...
                    </div>
                }
            >
                {context.dashboardFlow.map((element, index) => {
                    return (
                        <NewSharedPackage
                            user={element.user}
                            package={element.package}
                            key={`NewSharedPackage${index}`}
                        />
                    );
                })}
            </InfiniteScroll>
        </div>
    );
}
