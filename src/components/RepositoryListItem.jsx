import { View, StyleSheet, Image, Pressable, Button, Linking } from 'react-native';
import RepositoryStats from './RepositoryStats';
import Text from './Text';
import { useNavigate } from 'react-router-native';

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
        marginBottom: 5,
    },
    description: {
        marginBottom: 8,
    },
    languageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#0366d6',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    language: {
        color: 'white',
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: 'gray',
        fontSize: 12,
    },
});


export default function RepositoryListItem({ repository, formatCount, setId, githubUrl }) {
    const navigate = useNavigate();


    const handlePress = () => {
        setId(repository.id);
        navigate(`/${repository.id}`);
    };

    return (
        <View style={styles.repositoryItem}>
            <Pressable onPress={() => handlePress()}>
                <View style={styles.topContainer}>
                    <Image
                        source={{ uri: repository.ownerAvatarUrl }}
                        style={styles.avatar}
                    />
                    <View style={styles.contentContainer}>
                        <Text fontWeight="bold" fontSize="subheading" style={styles.title}>
                            {repository.fullName}
                        </Text>
                        <Text color="textSecondary" style={styles.description}>
                            {repository.description}
                        </Text>
                        <View style={styles.languageContainer}>
                            <Text style={styles.language}>{repository.language}</Text>
                        </View>
                    </View>
                </View>

                <RepositoryStats
                    forks={formatCount(repository.forksCount)}
                    stars={formatCount(repository.stargazersCount)}
                    rating={formatCount(repository.ratingAverage)}
                    reviews={formatCount(repository.reviewCount)}
                />
                {
                    githubUrl && (
                        <Button title='Open GitHub' color="primary" style={{ marginTop: 10 }} onPress={() => {
                            Linking.openURL(githubUrl);
                        }} />
                    )
                }
            </Pressable>
        </View>
    );
}