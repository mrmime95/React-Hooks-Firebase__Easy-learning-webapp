import React from 'react';
import { shallow } from 'enzyme';
import IconWithBadge from './IconWithBadge';

it('renders without crashing', () => {
    shallow(<IconWithBadge />);
});

it('renders badge value', () => {
    const wrapper = shallow(<IconWithBadge badgeValue="6" />);

    expect(wrapper.find('.badge').text()).toBe('6');
});

it('doesn not render badge', () => {
    const wrapper = shallow(<IconWithBadge badgeValue={0} />);

    expect(wrapper.find('.badge')).toHaveLength(0);
});
