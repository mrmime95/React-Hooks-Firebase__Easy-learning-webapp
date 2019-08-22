// @flow

import React from 'react';
import FormItem from '../FormItem/FormItem';
import './NumberField.css';
import { customInputEvent } from '../../../../utils';

export default function NumberField({
    className,
    label,
    name,
    value,
    maxValue = Number.MAX_SAFE_INTEGER,
    minValue = Number.MIN_SAFE_INTEGER,
    handleChange,
    handleBlur,
    required = false,
    readOnly = false,
}) {
    return (
        <FormItem className={`form-item number-field ${className || ''} ${required ? 'required' : ''}`} label={label}>
            <input
                type="number"
                name={name}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required={required}
                readOnly={readOnly}
            />
            <div className="control-buttons">
                <button className="button action dec" onClick={handleDecrement} type="submit">
                    -
                </button>
                <button className="button action inc" onClick={handleIncrement} type="submit">
                    +
                </button>
            </div>
        </FormItem>
    );

    function handleInputChange(event: SyntheticInputEvent<any>) {
        const targetValue = event.target.value;
        if (targetValue == null || targetValue.trim() === '') {
            emitChange('');
        } else {
            const inputValue = Number(event.target.value);

            if (inputValue >= minValue && inputValue <= maxValue) {
                emitChange(inputValue);
            } else {
                emitChange(value);
            }
        }
    }

    function handleDecrement() {
        const newValue = (String(value).length === 0 ? 1 : value) - 1;

        if (newValue >= minValue) {
            emitChange(newValue);
        }
    }

    function handleIncrement() {
        const newValue = (String(value).length === 0 ? -1 : value) + 1;

        if (newValue <= maxValue) {
            emitChange(newValue);
        }
    }

    function emitChange(value: number | '') {
        handleChange(customInputEvent(name, value));
    }
}
