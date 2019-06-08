import React from 'react';
import { shallow, mount } from 'enzyme';
import InfoRow from './InfoRow';

it('renders without crashing', () => {
    shallow(<InfoRow title="test" />);
});

it('gets props and children', () => {
    const wrapper = mount(<InfoRow label="test">TEST</InfoRow>);
    expect(wrapper.find('.label').text()).toBe('test');
    expect(wrapper.find('.value').text()).toBe('TEST');
});
