import React from 'react';
import './InfoRow.css';

export default function InfoRow(props: { label: string, children: string }) {
    return (
        <div className="row-label">
            <label className="label">{props.label}</label>
            <p className="value">{props.children}</p>
        </div>
    );
}
