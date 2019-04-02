// @flow
import React, { useState } from 'react';
import Octicon from '@githubprimer/octicons-react';
import Form from '../Form/Form';
import FormItem from '../Form/FormItem/FormItem';
import TextField from '../Form/fields/TextField/TextField';
import IconWithBadge from '../IconWithBadge/IconWithBadge';
import Combo from '../Form/fields/combo/Combo/Combo';
import FilterIcon from '../../icons/FilterIcon';
import AutoSubmit from '../Form/AutoSubmit';
import { debounce } from '../../../utils';
import { useTranslation } from 'react-i18next';

import type { ComboOption } from '../Form/fields/Combo/Combo/Combo';
import type { changeHandler, blurHandler, FormFieldProps } from '../Form/form-types';

import './SearchArea.css';

type SearchData<Filters> = {
    searchTerm?: string,
    sort: string,
    [filter: $Keys<Filters>]: any,
};

export type FilterProps<Filters> = {
    handleChange: changeHandler,
    handleBlur?: blurHandler,
    values: SearchData<Filters>,
};

type SearchAreaProps<Filters> = {
    sort: {
        options: ComboOption[],
    },
    initialValues: SearchData<Filters>,
    onSubmit: (searchData: SearchData<Filters>) => void,
    children?: (props: FilterProps<Filters>) => React$Node,
};

export default function SearchArea<Filters>(props: SearchAreaProps<Filters>) {
    const [filterVisible, setFilterVisible] = useState(false);

    const { children, initialValues } = props;
    const submit: (data: SearchData<Filters>) => void = debounce(debounceCallback, 300);

    return (
        <div className="search-area">
            <Form
                initialValues={{
                    searchTerm: '',
                    ...initialValues,
                }}
            >
                {({ handleChange, handleBlur, values, errors }: FormFieldProps<SearchData<any>>, FormRow) => {
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
        </div>
    );

    function toggleFilter() {
        setFilterVisible(!filterVisible);
    }

    function debounceCallback(data: SearchData<Filters>) {
        const sorting = data.sort.split('_');
        const newData = { ...data, sort: sorting[0], sortAscending: sorting[1] === 'asc' };
        props.onSubmit(newData);
    }
}

function FormRowSearchContainer(props) {
    const { values, handleChange, handleBlur, FormRow, sort, children, toggleFilter } = props;
    const filtered = Object.keys(values).filter(key => values[key] != null).length - 2;
    const [t] = useTranslation();
    return (
        <FormRow className="search-container">
            <TextField
                className="search-field"
                label={t('search-area.search')}
                name="searchTerm"
                value={values.searchTerm}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />
            {children && (
                <FormItem className="filter-toggle" label={t('search-area.filter')}>
                    <button className="filter-button" type="button" onClick={toggleFilter}>
                        <IconWithBadge badgeValue={filtered}>
                            <Octicon icon={FilterIcon} className="filter-icon" />
                        </IconWithBadge>
                    </button>
                </FormItem>
            )}
            <Combo
                label={t('search-area.sort')}
                name="sort"
                value={values.sort}
                className="sorting-combo"
                handleChange={handleChange}
                handleBlur={handleBlur}
                options={sort.options}
            />
        </FormRow>
    );
}
