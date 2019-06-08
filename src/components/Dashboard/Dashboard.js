import React, { useContext } from 'react';
import NewSharedPackage from '../shared/NewSharedPackage/NewSharedPackage';
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
                {context.dashboardFlow.length !== 0 ? (
                    context.dashboardFlow.map((element, index) => {
                        return (
                            <NewSharedPackage
                                user={element.user}
                                package={element.package}
                                key={`NewSharedPackage${index}`}
                            />
                        );
                    })
                ) : (
                    <div>There aren't any package shared with you...</div>
                )}
            </InfiniteScroll>
        </div>
    );
}
