import React from 'react';
import { shallow, mount } from 'enzyme';
import RadioButtonGroup from './RadioButtonGroup';

const radioButtons = [
    { label: 'test', type: 'test' },
    { label: 'test1', type: 'test1' },
    { label: 'test2', type: 'test2' },
];
it('renders without crashing', () => {
    shallow(<RadioButtonGroup radioButtons={radioButtons} onChange={() => {}} />);
});

it('renders label if it is added', () => {
    const wrapper = mount(<RadioButtonGroup label="test" radioButtons={radioButtons} onChange={() => {}} />);
    expect(wrapper.find('.radio-button-group>label').text()).toBe('test');
});

it('doesnt render label if it isnt added', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} onChange={() => {}} />);
    expect(wrapper.find('.radio-button-group>label')).toHaveLength(0);
});

it('renders any radioButtons as are given', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} onChange={() => {}} />);
    expect(wrapper.find('RadioButton')).toHaveLength(radioButtons.length);
});

it('gets name property', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} name="test" onChange={() => {}} />);
    expect(wrapper.find('#radio-button-group-test')).toHaveLength(1);
});

it('gets checked property', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} checked="test2" onChange={() => {}} />);
    expect(wrapper.find('RadioButton .active label').text()).toBe('test2');
});

it('renders any radioButtons as are given', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} onChange={() => {}} />);
    expect(wrapper.find('RadioButton')).toHaveLength(radioButtons.length);
});

it('gets property className', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} className="test" onChange={() => {}} />);
    expect(wrapper.find('.radio-button-group.test')).toHaveLength(1);
});

it('works without property className', () => {
    const wrapper = mount(<RadioButtonGroup radioButtons={radioButtons} onChange={() => {}} />);
    expect(wrapper.find('.radio-button-group')).toHaveLength(1);
});
