import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import ClickedOutsideChecker from './ClickedOutsideChecker';

const ComponentWithRef = React.forwardRef((props, ref) => {
    return (
        <div className="outside">
            <ClickedOutsideChecker onOutsideClick={props.spy}>
                <div className="inside" ref={ref}>
                    Inside
                </div>
            </ClickedOutsideChecker>
        </div>
    );
});

it('renders without crashing', () => {
    shallow(<ClickedOutsideChecker />);
});

it('dont call onOutsideClick if clicked inside', () => {
    const spy = jest.fn(x => {
        return 'OK';
    });
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
        map[event] = spy();
    });
    const wrapper = mount(<ComponentWithRef spy={spy} />);
    wrapper.find('.inside').simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
    expect(map.mousedown).toBe(undefined);
});
it('call onOutsideClick if clicked outside', () => {
    const spy = jest.fn(x => {
        return 'OK';
    });
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
        map[event] = spy();
    });
    const wrapper = mount(<ComponentWithRef spy={spy} />);
    wrapper.find('.outside').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(map.mousedown).toBe('OK');
});
