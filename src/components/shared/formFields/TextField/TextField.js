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
    AddExtra,
    autoFocus,
}) {
    return (
        <FormItem className={` text-field ${className || ''} ${required ? 'required' : ''}`} label={label}>
            <input
                placeholder={placeholder}
                type={type}
                name={name}
                value={value || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                autoFocus={autoFocus}
                min={min ? min : undefined}
                max={max ? max : undefined}
            />
            {AddExtra && <AddExtra />}
        </FormItem>
    );
}
