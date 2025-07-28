import React from 'react';
import { render } from '@testing-library/react-native';
import RepositoryList from '../../components/RepositoryList';

jest.mock('../../hooks/useRepos', () => () => ({
    repositories: {
        edges: [
            {
                node: {
                    id: '1',
                    fullName: 'test/repo',
                    description: 'Testing',
                    language: 'JavaScript',
                    forksCount: 1000,
                    stargazersCount: 1500,
                    ratingAverage: 90,
                    reviewCount: 3,
                    ownerAvatarUrl: 'https://example.com/avatar.png',
                },
            },
        ],
    },
}));

describe('RepositoryList', () => {
    it('renders list of repositories', () => {
        const { getByText } = render(<RepositoryList />);

        expect(getByText('test/repo')).toBeTruthy();
        expect(getByText('Testing')).toBeTruthy();
        expect(getByText('JavaScript')).toBeTruthy();

        expect(getByText('1.0k')).toBeTruthy(); // forks
        expect(getByText('1.5k')).toBeTruthy(); // stars
        expect(getByText('90')).toBeTruthy();   // rating
        expect(getByText('3')).toBeTruthy();    // reviews
    });
});