/* @flow */
import React from 'react';
import './Grid.css';
import { GridRow, LinkGridRow } from './GridRow/GridRow';

function Grid(props: {
    headerConfig?: Array<{ label: string, flex?: number }>,
    createRow: (data: any) => React$Element<typeof GridRow | typeof LinkGridRow>,
    data: Array<any>,
}) {
    return (
        <div className="grid">
            {props.headerConfig && (
                <div className="grid-header">
                    {props.headerConfig.map((value, index) => {
                        const style = {
                            flex: value.flex,
                        };
                        return (
                            <div
                                className={`grid-header-label ${value.label}`}
                                key={`GridHeader${index}`}
                                style={style}
                            >
                                {value.label}
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="grid-body">{props.data.map(props.createRow)}</div>
        </div>
    );
}

export default Grid;
