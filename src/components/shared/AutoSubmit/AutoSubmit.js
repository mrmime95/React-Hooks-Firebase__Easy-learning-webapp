import { useEffect, memo } from 'react';
import shallowequal from 'shallowequal';

type AutoSubmitProps<T> = {|
    data: T,
    onSubmit: (data: T) => void,
|};
function AutoSubmit<T>(props: AutoSubmitProps<T>) {
    useEffect(() => props.onSubmit(props.data));
    return null;
}
function shouldUpdate(prevProps: AutoSubmitProps<T>, nextProps: AutoSubmitProps<T>) {
    return shallowequal(prevProps.data, nextProps.data);
}
export default memo(AutoSubmit, shouldUpdate);
