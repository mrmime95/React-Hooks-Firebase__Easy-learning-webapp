import React from 'react';
import { mount } from 'enzyme';
import AccountInfo from './AccountInfo';
import i18n from '../../../i18nTests';
import { I18nextProvider } from 'react-i18next';
import AuthProvider from '../../AuthProvider/AuthProvider';
import { MemoryRouter } from 'react-router-dom';

const account = {
    full_name: 'Piet Janssen',
    email: 'pietjanssen@gmail.com',
};

it('renders without crashing', () => {
    mountAccountInfo();
});

it('hides the menu by default', () => {
    const component = mountAccountInfo();
    expect(component.find('AccountMenu').prop('visible')).toBe(false);
});

it('toggles menu visibility', () => {
    const component = mountAccountInfo();
    component.find('AvatarCircle').simulate('click');
    component.update();
    expect(component.find('AccountMenu').prop('visible')).toBe(true);
});

it('shows menu on click on avatar', () => {
    const component = mountAccountInfo();

    component.find('AvatarCircle').simulate('click');
    expect(component.find('div.account-menu.show')).toHaveLength(1);
});

it('hides menu on outside click', () => {
    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    const wrapper = mountAccountInfo();

    wrapper.find('AvatarCircle').simulate('click');
    expect(wrapper.find('AccountMenu').prop('visible')).toBe(true);

    wrapper.find('AvatarCircle').simulate('click');
    expect(wrapper.find('AccountMenu').prop('visible')).toBe(false);
});

it('removes document listener', () => {
    document.removeEventListener = jest.fn((event, cb) => {
        expect(event).toBe('mousedown');
    });

    const wrapper = mountAccountInfo();
    wrapper.unmount();
});

function mountAccountInfo() {
    return mount(
        <MemoryRouter>
            <AuthProvider>
                <I18nextProvider i18n={i18n}>
                    <AccountInfo account={account} />
                </I18nextProvider>
            </AuthProvider>
            )}
        </MemoryRouter>
    );
}
