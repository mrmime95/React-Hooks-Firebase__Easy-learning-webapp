import React from 'react';

import './WithTooltip.css';

export default function WithTooltip(props: {
    children: React$node,
    tooltip: string,
    onClick: () => void,
    className: string,
    tooltipPosition?:
        | 'top'
        | 'top-left'
        | 'top-right'
        | 'bottom'
        | 'bottom-left'
        | 'bottom-right'
        | 'right'
        | 'right-top'
        | 'right-bottom'
        | 'left'
        | 'left-top'
        | 'left-bottom',
}) {
    return (
        <div className={`tooltip-container ${props.className}`} onClick={props.onClick}>
            <div className={`tooltip ${props.tooltipPosition || 'right'}`}>{props.tooltip}</div>
            {props.children}
        </div>
    );
}
