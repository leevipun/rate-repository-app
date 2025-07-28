// __tests__/Example.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

test('renders hello', () => {
    const { getByText } = render(<Text>Hello test</Text>);
    expect(getByText('Hello test')).toBeTruthy();
});