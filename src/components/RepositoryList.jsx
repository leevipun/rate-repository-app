import { FlatList, View, StyleSheet, Text, Image } from 'react-native';
import RepositoryListItem from './RepositoryListItem';

// Add these styles to your StyleSheet
const styles = StyleSheet.create({
    separator: {
        height: 10,
    },
    repositoryItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
    },
    topContainer: {
        flexDirection: 'row',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    contentContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    description: {
        color: 'gray',
        marginBottom: 8,
    },
    languageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#0366d6',
        borderRadius: 4,
        padding: 4,
        paddingHorizontal: 8,
    },
    language: {
        color: 'white',
        fontSize: 12,
    },
});

const repositories = [
    {
        id: 'jaredpalmer.formik',
        fullName: 'jaredpalmer/formik',
        description: 'Build forms in React, without the tears',
        language: 'TypeScript',
        forksCount: 1589,
        stargazersCount: 21553,
        ratingAverage: 88,
        reviewCount: 4,
        ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
    },
    {
        id: 'rails.rails',
        fullName: 'rails/rails',
        description: 'Ruby on Rails',
        language: 'Ruby',
        forksCount: 18349,
        stargazersCount: 45377,
        ratingAverage: 100,
        reviewCount: 2,
        ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/4223?v=4',
    },
    {
        id: 'django.django',
        fullName: 'django/django',
        description: 'The Web framework for perfectionists with deadlines.',
        language: 'Python',
        forksCount: 21015,
        stargazersCount: 48496,
        ratingAverage: 73,
        reviewCount: 5,
        ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/27804?v=4',
    },
    {
        id: 'reduxjs.redux',
        fullName: 'reduxjs/redux',
        description: 'Predictable state container for JavaScript apps',
        language: 'TypeScript',
        forksCount: 13902,
        stargazersCount: 52869,
        ratingAverage: 0,
        reviewCount: 0,
        ownerAvatarUrl: 'https://avatars3.githubusercontent.com/u/13142323?v=4',
    },
];

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
    // Helper function to format numbers with 'k' suffix
    const formatCount = (count) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count;
    };

    return (
        <FlatList
            data={repositories}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={({ item }) => (
                <RepositoryListItem repository={item} formatCount={formatCount} />
            )}
            keyExtractor={item => item.id}
        />
    );
};

export default RepositoryList;