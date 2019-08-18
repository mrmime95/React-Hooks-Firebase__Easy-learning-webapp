import React from 'react';
import { Formik } from 'formik';

function FormRow({ className, children }: { className?: string, children: React$Node }) {
    return <div className={'form-row ' + (className || '')}>{children}</div>;
}

export default function Form({ initialValues, onSubmit, children, enableReinitialize, className }) {
    return (
        <Formik initialValues={initialValues} enableReinitialize={enableReinitialize} onSubmit={onSubmit || (() => {})}>
            {({ handleSubmit, handleChange, setFieldValue, setFieldTouched, handleBlur, values, errors, dirty }) => {
                return (
                    <form onSubmit={handleSubmit} className={`form ${className}`}>
                        {children &&
                            children(
                                { handleChange, handleBlur, setFieldValue, setFieldTouched, values, errors, dirty },
                                FormRow
                            )}
                    </form>
                );
            }}
        </Formik>
    );
}
