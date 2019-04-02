import React, { useContext } from 'react';
import { mount } from 'enzyme';
import UserListProvider, { UserListContext } from './UserListProvider';

import { users } from '../../../../dummyData/Users';

it('has defaults', () => {
    const spyFunction = jest.fn(x => {});
    mount(
        <UserListProvider users={users}>
            <UserListContext.Consumer>{spyFunction}</UserListContext.Consumer>
        </UserListProvider>
    );

    expect(spyFunction).toHaveBeenCalledWith(
        expect.objectContaining({
            pageSize: 10,
            pageOfUsers: expect.any(Array),
            activePage: 1,
            numberOfFilteredUsers: expect.any(Number),
            onPagingChange: expect.any(Function),
            onSearch: expect.any(Function),
            filteredUsers: expect.any(Array),
            sort: 'name',
            sortAscending: true,
        })
    );
});

it('handle search', () => {
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(UserListContext);
        return null;
    }
    const wrapper = mount(
        <UserListProvider users={users}>
            <div>
                <GetHook />
                <button
                    onClick={() => {
                        savedContext.onPagingChange({
                            activePage: 5,
                            pageSize: 2,
                        });
                        savedContext.onSearch({
                            searchTerm: 'dsadsad',
                            sort: 'name',
                            sortAscending: true,
                            roles: ['test'],
                            status: ['test'],
                        });
                    }}
                >
                    Test
                </button>
            </div>
        </UserListProvider>
    );

    wrapper.find('button').simulate('click');

    expect(savedContext.activePage).toBe(1);
});

it('handle page change', () => {
    const newActivePage = 5;
    const newPageSize = 12;
    let savedContext;
    function GetHook() {
        savedContext = React.useContext(UserListContext);
        return null;
    }
    const wrapper = mount(
        <UserListProvider users={users}>
            <div>
                <GetHook />
                <button
                    onClick={() => {
                        savedContext.onPagingChange({ activePage: newActivePage, pageSize: newPageSize });
                    }}
                >
                    Test
                </button>
            </div>
        </UserListProvider>
    );

    wrapper.find('button').simulate('click');

    expect(savedContext.pageSize).toEqual(newPageSize);
    expect(savedContext.pageOfUsers.length).toBe(newPageSize);
    expect(savedContext.activePage).toBe(newActivePage);
});
