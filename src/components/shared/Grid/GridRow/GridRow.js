/* @flow */
import React from 'react';
import type { ChildrenArray } from 'react';
import './GridRow.css';
import GridColumn from '../GridColumn/GridColumn';
import { Link } from 'react-router-dom';

type GridRowProps = {|
    className?: string,
    children: ChildrenArray<React$Element<typeof GridColumn>>,
|};

export function GridRow(props: GridRowProps) {
    return <div className={`grid-row ${props.className ? props.className : ''}`}>{props.children}</div>;
}

type LinkGridRowProps = {|
    ...GridRowProps,
    linkTo: string,
|};

export function LinkGridRow(props: LinkGridRowProps) {
    return (
        <Link className={`grid-row ${props.className ? props.className : ''}`} to={props.linkTo}>
            {props.children}
        </Link>
    );
}
