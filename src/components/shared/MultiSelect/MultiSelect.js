import React from 'react';
import Select from 'react-select';
import './MultiSelect.css';
export default function MultiSelect(props: {
    value: [{ value: string, label: string }],
    name: string,
    onChange: () => void,
    onBlur?: () => void,
    options: any,
    className?: string,
    placeholder?: string,
    isDisabled: boolean,
    label: string,
    withBorder?: boolean,
    extra?: React$Node,
}) {
    const ExtraComponent = props.extra;
    return (
        <div className={props.withBorder ? 'select-withborder' : ''}>
            {(props.label || props.extra) && (
                <div className="info-in-select">
                    {props.label && (
                        <label htmlFor={`${props.name}`} className="group-label">
                            {props.label}
                        </label>
                    )}
                    {props.extra && <ExtraComponent />}
                </div>
            )}
            {props.options ? (
                <Select
                    id={props.name}
                    options={props.options}
                    isMulti
                    onChange={props.onChange}
                    onBlur={props.onBlur && props.onBlur}
                    value={props.value}
                    className={props.className && props.className}
                    placeholder={props.placeholder && props.placeholder}
                    isDisabled={props.isDisabled}
                    getValue={value => {
                        console.log(value);
                    }}
                />
            ) : (
                <Select
                    id={props.name}
                    isLoading
                    isMulti
                    onChange={props.onChange}
                    onBlur={props.onBlur && props.onBlur}
                    value={props.value}
                    className={props.className && props.className}
                    placeholder={props.placeholder && props.placeholder}
                    isDisabled={props.isDisabled}
                />
            )}
        </div>
    );
}
