import React from 'react';
import { mount } from 'enzyme';
import GridWithPagination from './GridWithPagination';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../i18nTests';

it('renders with headerConfig property', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <GridWithPagination headerConfig={[{ label: 'test', flex: 1 }]} createRow={() => {}} data={[]} />
        </I18nextProvider>
    );
    expect(wrapper.find('.test').exists()).toBe(true);
});

it('renders with Grid', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <GridWithPagination headerConfig={[{ label: 'test', flex: 1 }]} createRow={() => {}} data={[]} />
        </I18nextProvider>
    );

    expect(wrapper.find('Grid')).toHaveLength(1);
});

it('renders with Pagination', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <GridWithPagination headerConfig={[{ label: 'test', flex: 1 }]} createRow={() => {}} data={[]} />
        </I18nextProvider>
    );
    expect(wrapper.find('Pagination')).toHaveLength(1);
});

it('renders with createRow property', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <GridWithPagination
                headerConfig={[]}
                createRow={testRowData => (
                    <div key={`test${Math.random()}`}>
                        <p>{testRowData.test}</p>
                        <p>{testRowData.s}</p>
                    </div>
                )}
                data={[{ test: 'test', s: 's' }]}
            />
        </I18nextProvider>
    );
    expect(wrapper.contains(<p>test</p>) && wrapper.contains(<p>s</p>)).toBe(true);
});
it('renders with data property', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <GridWithPagination
                headerConfig={[]}
                createRow={data => <p key={`test${Math.random()}`} className={data.test} />}
                data={[{ test: 'test' }, { test: 'test2' }]}
            />
        </I18nextProvider>
    );
    expect(wrapper.contains(<p className="test" />)).toBe(true);
});
