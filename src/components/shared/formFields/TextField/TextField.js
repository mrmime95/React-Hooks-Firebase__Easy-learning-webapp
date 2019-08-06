// @flow

import React from 'react';
import FormItem from '../FormItem/FormItem';

export default function TextField({
    className,
    label,
    name,
    value,
    handleChange,
    handleBlur,
    type = 'text',
    required = false,
    placeholder,
    min,
    max,
}) {
    return (
        <FormItem className={`form-item text-field ${className || ''} ${required ? 'required' : ''}`} label={label}>
            <input
                placeholder={placeholder}
                type={type}
                name={name}
                value={value || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                min={min ? min : undefined}
                max={max ? max : undefined}
            />
        </FormItem>
    );
}
