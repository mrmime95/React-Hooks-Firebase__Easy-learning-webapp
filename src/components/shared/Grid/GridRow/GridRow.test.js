import React from 'react';
import { shallow, mount } from 'enzyme';
import { GridRow, LinkGridRow } from './GridRow';
import { MemoryRouter } from 'react-router-dom';

it('renders without props', () => {
    const wrapper = shallow(<GridRow />);
    expect(wrapper.hasClass('grid-row')).toBe(true);
});
it('renders with className property', () => {
    const wrapper = shallow(<GridRow className="test" />);
    expect(wrapper.hasClass('test')).toBe(true);
});
it('renders with child', () => {
    const wrapper = shallow(
        <GridRow>
            <div>Test</div>;
        </GridRow>
    );
    expect(wrapper.contains(<div>Test</div>)).toBe(true);
});

it('renders with className property', () => {
    const wrapper = mountLinkGridRow();
    expect(wrapper.find('Link.test')).toHaveLength(1);
});
it('renders with child', () => {
    const wrapper = mountLinkGridRow();
    expect(wrapper.contains(<div>Test</div>)).toBe(true);
});

function mountLinkGridRow(subRoute = '') {
    return mount(
        <MemoryRouter initialEntries={['/linkgridrow-test' + subRoute]}>
            <LinkGridRow linkTo="test" className="test">
                <div>Test</div>
            </LinkGridRow>
        </MemoryRouter>
    );
}
