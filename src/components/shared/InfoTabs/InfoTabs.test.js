import React from 'react';
import InfoTabs from './InfoTabs';
import { shallow, mount } from 'enzyme';
import i18n from '../../../i18nTests';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

const routes = [
    {
        path: '',
        title: 'test1',
        exact: true,
        Component: () => <div className="test1">TEST1</div>,
    },
    {
        path: '/subroute',
        title: 'test2',
        Component: () => <div className="test2">TEST2</div>,
    },
];

it('renders without crashing', () => {
    shallow(<InfoTabs pathname="" />);
});

it('renders Tabs', () => {
    const wrapper = mountInfoTabs();
    expect(wrapper.find('Tabs')).toHaveLength(1);
});

it('renders gived tabs with correct routes', () => {
    const wrapper = mountInfoTabs();
    expect(wrapper.find('NavTabItem')).toHaveLength(2);
    expect(
        wrapper
            .find('NavTabItem')
            .first()
            .prop('to')
    ).toBe('/info-tabs');
    expect(
        wrapper
            .find('NavTabItem')
            .last()
            .prop('to')
    ).toBe('/info-tabs/subroute');
});

function mountInfoTabs(subRoute = '') {
    return mount(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter initialEntries={['/info-tabs' + subRoute]}>
                <InfoTabs
                    baseName={'info-tabs'}
                    routes={routes}
                    location={{ pathname: '/info-tabs', key: 22 }}
                    match={{ path: '/info-tabs', url: '/info-tabs' }}
                />
            </MemoryRouter>
        </I18nextProvider>
    );
}
