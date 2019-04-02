import React from 'react';
import { shallow, mount } from 'enzyme';
import SearchArea from './SearchArea';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18nTests';

it('renders without crashing', () => {
    shallow(<SearchArea />);
});

it('hides filters by default', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <SearchArea
                sort={{
                    options: [{ value: '', label: '' }],
                }}
                initialValues={{
                    sort: '',
                }}
                onSubmit={() => {}}
            />
        </I18nextProvider>
    );

    expect(wrapper.find('div.filter-container').prop('className')).toEqual(expect.stringMatching('hide'));
});

it('toggles filters', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <SearchArea
                sort={{
                    options: [{ value: '', label: '' }],
                }}
                initialValues={{
                    sort: '',
                }}
                onSubmit={() => {}}
            >
                {() => {}}
            </SearchArea>
        </I18nextProvider>
    );

    wrapper.find('.filter-button').simulate('click');

    expect(wrapper.find('div.filter-container').prop('className')).toEqual(expect.stringMatching('show'));
});

it('hide filter-button if has no children', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <SearchArea
                sort={{
                    options: [{ value: '', label: '' }],
                }}
                initialValues={{
                    sort: '',
                }}
                onSubmit={() => {}}
            />
        </I18nextProvider>
    );

    expect(wrapper.find('.filter-button')).toHaveLength(0);
});

it('submits', done => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <SearchArea
                sort={{
                    options: [{ value: '', label: '' }],
                }}
                initialValues={{
                    sort: '',
                }}
                onSubmit={data => {
                    expect(data.searchTerm).toBe('test search');
                    done();
                }}
            />
        </I18nextProvider>
    );

    wrapper
        .find('input[name="searchTerm"]')
        .simulate('change', { target: { name: 'searchTerm', value: 'test search' } });
});
