// @flow
import React, { useState } from 'react';
import Form from '../Form/Form';
import IconWithBadge from '../IconWithBadge/IconWithBadge';
import SimpleSelect from '../SimpleSelect/SimpleSelect';
import AutoSubmit from '../AutoSubmit/AutoSubmit';
import { debounce } from '../../../utils';

import './SearchArea.css';

export default function SearchArea(props: {
    sort: {
        options: ComboOption[],
    },
    initialValues: any,
    isLoading?: boolean,
}) {
    const [filterVisible, setFilterVisible] = useState(false);

    const { children, initialValues } = props;
    const submit: data => void = debounce(debounceCallback, 300);

    return (
        <div className="search-area">
            <Form
                initialValues={{
                    searchTerm: '',
                    ...initialValues,
                }}
                className={!props.isLoading ? 'show' : 'hide'}
            >
                {({ handleChange, handleBlur, values, errors }, FormRow) => {
                    return (
                        <div>
                            <FormRowSearchContainer
                                FormRow={FormRow}
                                {...props}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                values={values}
                                toggleFilter={toggleFilter}
                            />

                            <FormRow className={'filter-container ' + (filterVisible ? 'show' : 'hide')}>
                                {children &&
                                    children({
                                        values,
                                        handleChange,
                                        handleBlur,
                                    })}
                            </FormRow>

                            <AutoSubmit data={values} onSubmit={submit} />
                        </div>
                    );
                }}
            </Form>

            <div className={props.isLoading ? 'show' : 'hide'}>Loading...</div>
        </div>
    );

    function toggleFilter() {
        setFilterVisible(!filterVisible);
    }

    function debounceCallback(data: SearchData<Filters>) {
        const newData = { ...data };
        props.onSubmit(newData);
    }
}

function FormRowSearchContainer(props) {
    const { values, handleChange, handleBlur, FormRow, sort, children, toggleFilter } = props;
    return (
        <FormRow className="search-container">
            <input
                name="searchTerm"
                value={values.searchTerm}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control search-field"
                placeholder="Search"
                type="text"
            />
            {children && (
                <button className="filter-button" type="button" onClick={toggleFilter}>
                    <IconWithBadge badgeValue={0}>
                        <i className="fas fa-filter" />
                    </IconWithBadge>
                </button>
            )}
            <SimpleSelect
                value={values.sort}
                name="sort"
                handleChange={handleChange}
                onBlur={handleBlur}
                options={sort.options}
                className="sorting-combo"
            />
        </FormRow>
    );
}
