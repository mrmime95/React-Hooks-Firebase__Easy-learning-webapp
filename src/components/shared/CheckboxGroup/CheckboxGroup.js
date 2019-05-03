import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

export default function CheckboxGroup(props: {
    name: string,
    checkboxes: [{ label: string, id: string }],
    checked: [string],
    onChange: () => void,
    onBlur: () => void,
    className?: string,
    label?: string,
}) {
    return (
        <div className={`checkbox-group ${props.className}`}>
            {props.label && (
                <label htmlFor={`checkbox-group-${props.name}`} className="group-label">
                    {props.label}
                </label>
            )}
            <div className="checkbox-container" id={`checkbox-group-${props.name}`}>
                {props.checkboxes.map((checkbox, index) => {
                    const checked = props.checked.includes(checkbox.id);
                    return (
                        <Checkbox
                            handleChange={() => props.onChange(checkbox.id, checked)}
                            name={props.name}
                            checked={checked}
                            label={checkbox.label}
                            key={`Checbox${checkbox.id}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
