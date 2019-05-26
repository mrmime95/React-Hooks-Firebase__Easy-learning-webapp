/* @flow */
import React from 'react';
import './IconWithBadge.css';

export default function IconWithBadge(props: { badgeValue: number, children: React$Node }) {
    return (
        <div className="badged-icon">
            {props.children}
            {props.badgeValue > 0 && <span className="badge">{props.badgeValue}</span>}
        </div>
    );
}
