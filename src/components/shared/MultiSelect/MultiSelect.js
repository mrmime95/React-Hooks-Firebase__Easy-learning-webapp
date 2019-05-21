import React from 'react';
import Select from 'react-select';

export default function MultiSelect(props: {
    value: [{ value: string, label: string }],
    name: string,
    onChange: () => void,
    onBlur: () => void,
    options: any,
    className?: string,
    placeholder?: string,
    isDisabled: boolean,
}) {
    return props.options ? (
        <Select
            id={props.name}
            options={props.options}
            isMulti
            onChange={handleChange}
            onBlur={handleBlur}
            value={props.value}
            className={props.className && props.className}
            placeholder={props.placeholder && props.placeholder}
            isDisabled={props.isDisabled}
        />
    ) : (
        <Select
            id={props.name}
            isLoading
            isMulti
            onChange={handleChange}
            onBlur={handleBlur}
            value={props.value}
            className={props.className && props.className}
            placeholder={props.placeholder && props.placeholder}
            isDisabled={props.isDisabled}
        />
    );
    function handleChange(value) {
        props.onChange(props.name, value);
    }

    function handleBlur() {
        props.onBlur(props.name, true);
    }
}
