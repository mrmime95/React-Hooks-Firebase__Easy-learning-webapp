import React from 'react';
import { mount } from 'enzyme';
import Pagination from './Pagination';
import i18n from '../../../i18nTests';
import { I18nextProvider } from 'react-i18next';

it('renders without props', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination />
        </I18nextProvider>
    );
    expect(wrapper.find('div.pagination')).toHaveLength(1);
});

it('renders page size', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination pageSize={50} numberOfElements={557} />
        </I18nextProvider>
    );

    expect(wrapper.find('select[name="size"]').prop('value')).toBe(50);
});

it('renders not page size if not enought data', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination numberOfElements={7} />
        </I18nextProvider>
    );
    expect(wrapper.find('select[name="size"]')).toHaveLength(0);
});

it('calculates number of pages', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination pageSize={13} numberOfElements={150} />
        </I18nextProvider>
    );

    expect(
        wrapper
            .find('button.number-button')
            .last()
            .text() === String(Math.ceil(150 / 13))
    ).toBe(true);
});

it('renders active page', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination activePage={3} numberOfElements={43} pageSize={2} />
        </I18nextProvider>
    );

    expect(wrapper.find('button.number-button.active').text()).toBe('3');
});
it('renders number of elements', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination numberOfElements={0} pageSize={434} />
        </I18nextProvider>
    );

    expect(wrapper.find('div.paging')).toHaveLength(0);
});

it('renders non page buttons for single page', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination pageSize={5} numberOfElements={5} />
        </I18nextProvider>
    );

    expect(wrapper.find('div.paging')).toHaveLength(0);
});

it('calls page change handler', () => {
    const spyFunction = jest.fn();

    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination onPagingChange={spyFunction} activePage={5} numberOfElements={98} pageSize={10} />
        </I18nextProvider>
    );

    wrapper
        .find('button.number-button')
        .findWhere(x => x.text() === String(Math.ceil(98 / 10)))
        .first()
        .simulate('click');

    expect(spyFunction).toHaveBeenCalledWith({ activePage: 10, pageSize: 10 });
});

it('calls handler on prev page click', () => {
    const spyFunction = jest.fn();

    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination onPagingChange={spyFunction} activePage={4} numberOfElements={20} pageSize={2} />
        </I18nextProvider>
    );

    wrapper
        .find('button.nav-button')
        .first()
        .simulate('click');

    expect(spyFunction).toHaveBeenCalledWith({ activePage: 3, pageSize: 2 });
});

it('calls handler on next page click', () => {
    const spyFunction = jest.fn();

    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination onPagingChange={spyFunction} activePage={4} numberOfElements={20} pageSize={2} />
        </I18nextProvider>
    );
    wrapper
        .find('button.nav-button')
        .last()
        .simulate('click');

    expect(spyFunction).toHaveBeenCalledWith({ activePage: 5, pageSize: 2 });
});

it('calls handler on page size change', () => {
    const spyFunction = jest.fn();

    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination pageSize={50} onPagingChange={spyFunction} numberOfElements={785} />
        </I18nextProvider>
    );

    wrapper.find('select[name="size"]').simulate('change', { target: { value: '100' } });
    expect(spyFunction).toHaveBeenCalledWith({ activePage: 1, pageSize: 100 });
});

it('renders active page in the middle', () => {
    const wrapper = mount(
        <I18nextProvider i18n={i18n}>
            <Pagination activePage={33} numberOfElements={203} pageSize={2} />
        </I18nextProvider>
    );

    expect(wrapper.find('span.dots')).toHaveLength(2);
});
