import React from 'react';
import { shallow, mount } from 'enzyme';
import NumberField from './NumberField';
import { waitForAutoSubmit } from '../../../../../testUtils';

it('renders without crashing', () => {
    shallow(<NumberField />);
});

it('gets onClick on increment', () => {
    const spyFunction = jest.fn(x => {
        return x.target.value;
    });
    const wrapper = mount(<NumberField className="test" value={8} maxValue={9} handleChange={() => {}} />);
    wrapper.find('.inc').simulate('click');
    waitForAutoSubmit(() => {
        expect(spyFunction.mock.results[0].value).toBe(9);
    });
});

it('gets onClick on decrement', () => {
    const spyFunction = jest.fn(x => {
        return x.target.value;
    });
    const wrapper = mount(<NumberField className="test" value={8} maxValue={9} handleChange={() => {}} />);
    wrapper.find('.dec').simulate('click');
    waitForAutoSubmit(() => {
        expect(spyFunction.mock.results[0].value).toBe(7);
    });
});

it('gets onClick validated number to remain the same', () => {
    const spyFunction = jest.fn(x => {
        return x.target.value;
    });
    const wrapper = mount(<NumberField className="test" value={9} maxValue={9} handleChange={() => {}} />);
    wrapper.find('.inc').simulate('click');
    waitForAutoSubmit(() => {
        expect(spyFunction.mock.results[0].value).toBe(9);
    });
});
