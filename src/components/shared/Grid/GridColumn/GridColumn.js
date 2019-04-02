/* @flow */
import React from 'react';
import './GridColumn.css';

export default function GridColumn(props: { className?: string, children: React$Node, label?: string }) {
    const hasLabel = props.label !== undefined;
    return (
        <div className={'column ' + (props.className ? props.className : '') + (hasLabel ? ' with-label' : '')}>
            {hasLabel && <label className="label">{props.label}</label>}
            {props.children}
        </div>
    );
}
