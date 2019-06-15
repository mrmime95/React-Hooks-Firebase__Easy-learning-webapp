// @flow strict

import React, { useContext } from 'react';
import { CustomUserDetailContext } from '../CustomUserDetailProvider/CustomUserDetailProvider';
import InfiniteScroll from 'react-infinite-scroller';
import NewSharedPackage from '../../../shared/NewSharedPackage/NewSharedPackage';

function CustomUserDashboard() {
    const context = useContext(CustomUserDetailContext);
    if (context.customUser) {
        return (
            <div>
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
                        <div>There aren't any packages...</div>
                    )}
                </InfiniteScroll>
            </div>
        );
    }
    return null;
}

export default CustomUserDashboard;
