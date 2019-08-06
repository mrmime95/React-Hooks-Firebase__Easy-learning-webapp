// @flow
import React from 'react';
import './FormItem.css';

export type FormItemProps = {|
    className?: string,
    label?: string,
|};

type Props = {| ...FormItemProps, children: React$Node |};

export default (props: Props) => {
    const { className, label, children } = props;

    return (
        <div className={`form-item ${className || ''}`}>
            {label && <label className="label">{label}</label>}
            <div className="input-container">{children}</div>
        </div>
    );
};
