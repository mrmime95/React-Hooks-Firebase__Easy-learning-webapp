// @flow

export type changeHandler = (e: SyntheticInputEvent<HTMLElement>) => any;
export type blurHandler = (e: SyntheticInputEvent<HTMLElement>) => void;

export type FormFieldProps<Values> = {|
    handleChange: changeHandler,
    handleBlur: blurHandler,
    values: Values,
    errors: { [name: $Keys<Values>]: ?string },
    dirty?: boolean,
|};
