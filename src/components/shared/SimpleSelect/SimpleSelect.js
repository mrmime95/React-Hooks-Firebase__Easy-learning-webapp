import React from 'react';
import Select from 'react-select';

export default function SimpleSelect(props: {
    value: [{ value: string, label: string }],
    name: string,
    handleChange: () => void,
    onBlur?: () => void,
    options: any,
    className?: string,
    placeholder?: string,
    isDisabled: boolean,
    label: string,
}) {
    return (
        <div className={props.className && props.className}>
            {props.label && (
                <label htmlFor={`${props.name}`} className="group-label">
                    {props.label}
                </label>
            )}
            {props.options ? (
                <Select
                    defaultValue={props.value}
                    id={props.name}
                    options={props.options}
                    onChange={data => {
                        props.handleChange({
                            target: { name: props.name, value: data },
                        });
                    }}
                    onBlur={props.onBlur && props.onBlur}
                    placeholder={props.placeholder && props.placeholder}
                    isDisabled={props.isDisabled}
                    getValue={value => {
                        console.log(value);
                    }}
                    type="text"
                />
            ) : (
                <Select
                    id={props.name}
                    isLoading
                    onChange={data => {
                        props.handleChange({
                            target: { name: props.name, value: data.value },
                        });
                    }}
                    onBlur={props.onBlur && props.onBlur}
                    defaultValue={props.value}
                    placeholder={props.placeholder && props.placeholder}
                    isDisabled={props.isDisabled}
                    type="text"
                />
            )}
        </div>
    );
}
