import React from 'react';
import { shallow, mount } from 'enzyme';
import InfoBlock from './InfoBlock';

it('renders without crashing', () => {
    shallow(<InfoBlock title="test" />);
});

it('doesnt render type and icon if they are not passed', () => {
    const wrapper = mount(
        <InfoBlock title="test">
            <div className="test">TEST</div>
        </InfoBlock>
    );
    expect(wrapper.find('.title .text').text()).toBe('test');
    expect(wrapper.find('.icon-container')).toHaveLength(0);
    expect(wrapper.find('.type')).toHaveLength(0);
});

it('gets props and children', () => {
    const wrapper = mount(
        <InfoBlock
            title="test"
            headerExtras={<div className="header-extras">TEST EXTRAS</div>}
            className="test-class-name"
        >
            <div className="test">TEST</div>
        </InfoBlock>
    );
    expect(wrapper.find('.title .text').text()).toBe('test');
    expect(wrapper.find('.header-extras').text()).toBe('TEST EXTRAS');
    expect(wrapper.find('.info-block.test-class-name')).toHaveLength(1);
    expect(wrapper.find('.test').text()).toBe('TEST');
});
