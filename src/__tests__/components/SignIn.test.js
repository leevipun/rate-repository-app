import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '../../components/SignIn';

const mockSignInUser = jest.fn(() => Promise.resolve('fake-token'));

jest.mock('../../hooks/useSignIn', () => ({
    useSignIn: () => [mockSignInUser, {}],
}));

const mockSetAccessToken = jest.fn(() => Promise.resolve());

jest.mock('../../hooks/useAuthStorage', () => () => ({
    setAccessToken: mockSetAccessToken,
}));

const mockResetStore = jest.fn();
jest.mock('@apollo/client', () => ({
    useApolloClient: () => ({
        resetStore: mockResetStore,
    }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-native', () => ({
    useNavigate: () => mockNavigate,
}));

describe('SignIn Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls signInUser with correct credentials on submit', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn />);

        fireEvent.changeText(getByPlaceholderText('Username'), 'myuser');
        fireEvent.changeText(getByPlaceholderText('Password'), 'mypassword');
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
            expect(mockSignInUser).toHaveBeenCalledWith({
                username: 'myuser',
                password: 'mypassword',
            });
            expect(mockSetAccessToken).toHaveBeenCalledWith('fake-token');
            expect(mockResetStore).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});