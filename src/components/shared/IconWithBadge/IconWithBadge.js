/* @flow */
import React from 'react';
import './IconWithBadge.css';

export default function IconWithBadge(props: { badgeValue: number, children: React$Node, className: string }) {
    return (
        <div className={`${props.className} badged-icon`}>
            {props.children}
            {props.badgeValue > 0 && <span className="badge">{props.badgeValue}</span>}
        </div>
    );
}
