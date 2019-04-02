import React from 'react';
import { shallow } from 'enzyme';
import AvatarCircle from './AvatarCircle';

it('renders without crashing', () => {
    shallow(<AvatarCircle fullName="test" />);
});
