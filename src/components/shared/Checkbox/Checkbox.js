import React from 'react';
import './Checkbox.css';
import Octicon, { Check } from '@githubprimer/octicons-react';
export default function Checkbox({ className, label, name, handleChange, handleBlur, checked, readOnly }) {
    return (
        <div className={`checkbox-field ${className || ''}`}>
            <label className={`checkbox ${readOnly ? 'read-only' : ''}`}>
                <input
                    type="checkbox"
                    name={name}
                    onChange={!readOnly ? handleChange : undefined}
                    onBlur={!readOnly ? handleBlur : undefined}
                    defaultChecked={checked || false}
                />
                <div className={`box ${checked ? 'checked' : ''}`}>
                    <Octicon icon={Check} className="icon" />
                </div>
                <span className="checkbox-label">{label}</span>
            </label>
        </div>
    );
}
