/* @flow */
import React from 'react';
import type { ChildrenArray } from 'react';
import './GridRow.css';
import GridColumn from '../GridColumn/GridColumn';

type GridRowProps = {|
    className?: string,
    children: ChildrenArray<React$Element<typeof GridColumn>>,
|};

export function GridRow(props: GridRowProps) {
    return <div className={`grid-row ${props.className ? props.className : ''}`}>{props.children}</div>;
}
