import React from 'react';
import { shallow } from 'enzyme';
import GridColumn from './GridColumn';

it('renders without props', () => {
    const wrapper = shallow(<GridColumn />);
    expect(wrapper.hasClass('column')).toBe(true);
});

it('renders with className property ', () => {
    const wrapper = shallow(<GridColumn className="test" />);
    expect(wrapper.hasClass('test')).toBe(true);
});

it('renders with child', () => {
    const wrapper = shallow(
        <GridColumn>
            <div>Test</div>
        </GridColumn>
    );
    expect(wrapper.contains(<div>Test</div>)).toBe(true);
});

it('renders with label property', () => {
    const wrapper = shallow(<GridColumn label="test" />);
    expect(wrapper.hasClass('with-label')).toBe(true);
});
