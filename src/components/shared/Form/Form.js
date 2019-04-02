// @flow

import React from 'react';
import { Formik } from 'formik';
import type { FormikProps } from 'formik';
import type { FormFieldProps } from './form-types';
import './Form.css';

function FormRow({ className, children }: { className?: string, children: React$Node }) {
    return <div className={'form-row ' + (className || '')}>{children}</div>;
}

type FormRowType = typeof FormRow;

type FormProps<Values> = {
    initialValues?: Values,
    onSubmit?: (values: Values) => void,
    children?: (props: FormFieldProps<Values>, FormRow: FormRowType) => React$Node,
};

export default function Form<Values: {}>({ initialValues, onSubmit, children }: FormProps<Values>) {
    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit || (() => {})}>
            {({ handleSubmit, handleChange, handleBlur, values, errors, dirty }: FormikProps<Values>) => {
                return (
                    <form onSubmit={handleSubmit} className="form">
                        {children && children({ handleChange, handleBlur, values, errors, dirty }, FormRow)}
                    </form>
                );
            }}
        </Formik>
    );
}
