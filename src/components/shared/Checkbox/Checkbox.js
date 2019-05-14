import React from 'react';
import './Checkbox.css';
import Octicon, { Check } from '@githubprimer/octicons-react';
export default function Checkbox({ className, label, name, handleChange, handleBlur, checked }) {
    return (
        <div className={`checkbox-field ${className || ''}`}>
            <label className="checkbox">
                <input
                    type="checkbox"
                    name={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={checked || false}
                />
                <div className={`box ${checked ? 'checked' : ''}`}>
                    <Octicon icon={Check} className="icon" />
                </div>
                <span className="checkbox-label">{label}</span>
            </label>
        </div>
    );
}
