/* @flow */
import React, { useContext } from 'react';
import Grid from '../Grid';
import { GridRow, LinkGridRow } from '../GridRow/GridRow';
import Pagination from '../../Pagination/Pagination';
import GridWithPaginationProvider, {
    GridWithPaginationContext,
} from './GridWithPaginationProvider/GridWithPaginationProvider';

function GridWithPagination(props: {
    createRow: (data: any) => React$Element<typeof GridRow | typeof LinkGridRow>,
    headerConfig?: Array<{ label: string, flex?: number }>,
    data: Array<any>,
}) {
    return (
        <GridWithPaginationProvider data={props.data}>
            <GridWithPaginationContent
                createRow={props.createRow}
                headerConfig={props.headerConfig && props.headerConfig}
            />
        </GridWithPaginationProvider>
    );
}

function GridWithPaginationContent(props: {
    createRow: (data: any) => React$Element<typeof GridRow | typeof LinkGridRow>,
    headerConfig?: Array<{ label: string, flex?: number }>,
}) {
    const context = useContext(GridWithPaginationContext);
    return (
        <div className="grid-with-pagination">
            <Grid
                createRow={props.createRow}
                data={context.pageOfElements}
                headerConfig={props.headerConfig && props.headerConfig}
            />
            <Pagination
                pageSize={context.pageSize}
                activePage={context.activePage}
                numberOfElements={context.numberOfElements}
                onPagingChange={context.onPagingChange}
            />
        </div>
    );
}

export default GridWithPagination;
