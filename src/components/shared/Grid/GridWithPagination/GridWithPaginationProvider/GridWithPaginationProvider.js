import React, { useState, useEffect } from 'react';
export const GridWithPaginationContext = React.createContext();

function GridWithPaginationProvider(props: {
    data: Array<any>,
    pageSize?: number,
    activePage?: number,
    children: React$Node,
}) {
    const activePage = props.activePage ? props.activePage : 1;
    const pageSize = props.pageSize ? props.pageSize : 5;

    const [state, setState] = useState({
        activePage,
        pageSize,
        numberOfElements: props.data.length,
        pageOfElements: getAPageOfContent(activePage, pageSize, props.data),
        data: props.data,
    });

    useEffect(() => {
        if (props.data !== state.data) {
            setState({
                ...state,
                numberOfElements: props.data.length,
                pageOfElements: getAPageOfContent(activePage, pageSize, props.data),
                data: props.data,
            });
        }
    });

    return (
        <GridWithPaginationContext.Provider value={{ ...state, onPagingChange, getAPageOfContent }}>
            {props.children}
        </GridWithPaginationContext.Provider>
    );

    function onPagingChange(newState: { activePage: number, pageSize: number }) {
        setState({
            ...state,
            activePage: newState.activePage,
            pageSize: newState.pageSize,
            pageOfElements: getAPageOfContent(newState.activePage, newState.pageSize, props.data),
        });
    }

    function getAPageOfContent(activePage: number, pageSize: number, content: any) {
        return content.slice((activePage - 1) * pageSize, Math.min(activePage * pageSize, content.length));
    }
}

export default GridWithPaginationProvider;
