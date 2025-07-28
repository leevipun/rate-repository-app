import React from 'react';
import { render } from '@testing-library/react-native';
import RepositoryListItem from '../../components/RepositoryListItem';

describe('RepositoryListItem', () => {
    const repository = {
        id: '1',
        fullName: 'test/repo',
        description: 'Test description',
        language: 'JavaScript',
        forksCount: 1500,
        stargazersCount: 3000,
        ratingAverage: 88,
        reviewCount: 4,
        ownerAvatarUrl: 'https://example.com/avatar.png',
    };

    const formatCount = (value) => {
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    };

    it('renders repository information correctly', () => {
        const { getByText } = render(
            <RepositoryListItem repository={repository} formatCount={formatCount} />
        );

        expect(getByText('test/repo')).toBeTruthy();
        expect(getByText('Test description')).toBeTruthy();
        expect(getByText('JavaScript')).toBeTruthy();

        expect(getByText('1.5k')).toBeTruthy(); // forks
        expect(getByText('3.0k')).toBeTruthy(); // stars
        expect(getByText('88')).toBeTruthy();   // rating
        expect(getByText('4')).toBeTruthy();    // reviews

        expect(getByText('Forks')).toBeTruthy();
        expect(getByText('Stars')).toBeTruthy();
        expect(getByText('Rating')).toBeTruthy();
        expect(getByText('Reviews')).toBeTruthy();
    });
});