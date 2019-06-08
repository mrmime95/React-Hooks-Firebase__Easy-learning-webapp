import React from 'react';

import './InfoBlock.css';

export default function InfoBlock(props: {
    title: string,
    className?: string,
    headerExtras?: ComponentType<any>,
    children: React$node,
}) {
    return (
        <div className={`info-block ${props.className && props.className}`}>
            <div className="title">
                <h3 className="text">{props.title}</h3>
                {props.headerExtras && props.headerExtras}
            </div>
            {props.children}
        </div>
    );
}
