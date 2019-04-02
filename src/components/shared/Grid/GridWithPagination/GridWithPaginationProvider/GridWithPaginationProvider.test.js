import React from 'react';
import { shallow, mount } from 'enzyme';
import GridWithPaginationProvider, { GridWithPaginationContext } from './GridWithPaginationProvider';
import { act } from 'react-dom/test-utils';

it('context sets defaults if has not props', () => {
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(GridWithPaginationContext);
        return null;
    }
    mount(
        <GridWithPaginationProvider data={[]}>
            <div className="test">TEST</div>
            <GetHook />
        </GridWithPaginationProvider>
    );
    expect(savedContext.activePage).not.toBe(undefined);
    expect(savedContext.pageSize).not.toBe(undefined);
});

it('context gets props and children', () => {
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(GridWithPaginationContext);
        return null;
    }
    const pageSize = 432432;
    const activePage = 324;
    const wrapper = mount(
        <GridWithPaginationProvider pageSize={pageSize} activePage={activePage} data={[]}>
            <div className="test">TEST</div>
            <GetHook />
        </GridWithPaginationProvider>
    );
    expect(savedContext.activePage).toBe(activePage);
    expect(savedContext.pageSize).toBe(pageSize);
    expect(wrapper.find('.test').text()).toBe('TEST');
});

it('changes page on onPagingChange function', () => {
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(GridWithPaginationContext);
        return null;
    }
    const pageSize = 432432;
    const activePage = 324;
    const wrapper = mount(
        <GridWithPaginationProvider pageSize={pageSize} activePage={activePage} data={[]}>
            <div className="test">TEST</div>
            <GetHook />
        </GridWithPaginationProvider>
    );
    const newPageSize = 33;
    const newActivePage = 546;
    act(() => {
        savedContext.onPagingChange({ activePage: newActivePage, pageSize: newPageSize });
    });
    expect(savedContext.activePage).toBe(newActivePage);
    expect(savedContext.pageSize).toBe(newPageSize);
});

it('gets correct numberOfElements', () => {
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(GridWithPaginationContext);
        return null;
    }
    const pageSize = 432432;
    const activePage = 324;
    const wrapper = mount(
        <GridWithPaginationProvider pageSize={pageSize} activePage={activePage} data={[]}>
            <div className="test">TEST</div>
            <GetHook />
        </GridWithPaginationProvider>
    );
    expect(savedContext.numberOfElements).toBe(0);
});

it('calculates the correct pageOfElements', () => {
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(GridWithPaginationContext);
        return null;
    }
    const pageSize = 1;
    const activePage = 3;

    const data = ['test1', 'test2', 'test3', 'test4'];

    const wrapper = mount(
        <GridWithPaginationProvider pageSize={pageSize} activePage={activePage} data={data}>
            <div className="test">TEST</div>
            <GetHook />
        </GridWithPaginationProvider>
    );
    expect(savedContext.pageOfElements.length).toBe(1);
    expect(savedContext.pageOfElements[0]).toBe('test3');
});
