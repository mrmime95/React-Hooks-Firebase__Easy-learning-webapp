import React from 'react';
import { shallow } from 'enzyme';
import Grid from './Grid';

it('renders with headerConfig property', () => {
    const wrapper = shallow(<Grid headerConfig={[{ label: 'test', flex: 1 }]} createRow={() => {}} data={[]} />);
    expect(wrapper.find('.test').exists()).toBe(true);
});
it('renders with createRow property', () => {
    const wrapper = shallow(
        <Grid
            headerConfig={[]}
            createRow={testRowData => (
                <div key={`test${Math.random()}`}>
                    <p>{testRowData.test}</p>
                    <p>{testRowData.s}</p>
                </div>
            )}
            data={[{ test: 'test', s: 's' }]}
        />
    );
    expect(wrapper.contains(<p>test</p>) && wrapper.contains(<p>s</p>)).toBe(true);
});
it('renders with data property', () => {
    const wrapper = shallow(
        <Grid
            headerConfig={[]}
            createRow={data => <p key={`test${Math.random()}`} className={data.test} />}
            data={[{ test: 'test' }, { test: 'test2' }]}
        />
    );
    expect(wrapper.contains(<p className="test" />)).toBe(true);
});
