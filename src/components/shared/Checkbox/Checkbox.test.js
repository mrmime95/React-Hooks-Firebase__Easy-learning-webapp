import React from 'react';
import { shallow } from 'enzyme';
import Checkbox from './Checkbox';

it('renders without crashing', () => {
    shallow(<Checkbox />);
});

it('renders form item', () => {
    const wrapper = shallow(<Checkbox />);
    expect(wrapper.find('FormItem.checkbox-field')).toHaveLength(1);
});

it('renders sets the name on the checkbox input', () => {
    const wrapper = shallow(<Checkbox name="test" />);

    expect(wrapper.find('[name="test"]')).toHaveLength(1);
});

it('renders false as default value on the checkbox input', () => {
    const wrapper = shallow(<Checkbox name="test" />);

    expect(wrapper.find('[name="test"]').prop('checked')).toBe(false);
});

it('renders the value on the checkbox input', () => {
    const wrapper = shallow(<Checkbox name="test" checked={true} />);

    expect(wrapper.find('[name="test"]').prop('checked')).toBe(true);
});

it('calls change handler from props on click', () => {
    const wrapper = shallow(
        <Checkbox
            name="test"
            handleChange={e => {
                expect(e.target.value).toBe(true);
            }}
        />
    );

    wrapper.find('[name="test"]').simulate('click');
});

it('calls blur handeler from props', () => {
    const wrapper = shallow(
        <Checkbox
            name="testField"
            handleBlur={e => {
                expect(e.target.value).toBe('test');
            }}
        />
    );

    wrapper.find('[name="testField"]').simulate('blur', { target: { value: 'test' } });
});
