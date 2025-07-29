import { gql, useQuery } from "@apollo/client";
import RepositoryListItem from "./RepositoryListItem";
import Text from "./Text";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const REPOSITORY_QUERY = gql`
    query Repository($repositoryId: ID!, $first: Int, $after: String) {
        repository(id: $repositoryId) {
            id
            ownerName
            name
            createdAt
            fullName
            ratingAverage
            reviewCount
            stargazersCount
            watchersCount
            forksCount
            openIssuesCount
            url
            ownerAvatarUrl
            description
            language
            userHasReviewed
            reviews(first: $first, after: $after) {
                edges {
                    node {
                        id
                        text
                        rating
                        createdAt
                        user {
                            id
                            username
                        }
                    }
                    cursor
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`;

export default function SingleRepo({ id }) {
    const { data, loading, error, fetchMore } = useQuery(REPOSITORY_QUERY, {
        variables: { repositoryId: id, first: 3 },
        fetchPolicy: "cache-and-network",
    });

    if (loading && !data) return <ActivityIndicator size="large" color="#0366d6" style={styles.loading} />;
    if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

    const repository = data.repository;
    const reviews = repository.reviews.edges.map(edge => edge.node);
    const pageInfo = repository.reviews.pageInfo;

    const handleFetchMore = () => {
        if (pageInfo.hasNextPage) {
            fetchMore({
                variables: {
                    after: pageInfo.endCursor,
                    first: 3,
                    repositoryId: id,
                },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prevResult;

                    return {
                        repository: {
                            ...prevResult.repository,
                            reviews: {
                                ...fetchMoreResult.repository.reviews,
                                edges: [
                                    ...prevResult.repository.reviews.edges,
                                    ...fetchMoreResult.repository.reviews.edges,
                                ],
                                pageInfo: fetchMoreResult.repository.reviews.pageInfo,
                            },
                        },
                    };
                },
            });
        }
    };

    const formatCount = (count) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
        return count;
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i <= rating ? "star" : "star-o"}
                    size={16}
                    color="#FFD700"
                    style={styles.star}
                />
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <RepositoryListItem
                repository={repository}
                formatCount={formatCount}
                githubUrl={repository.url}
            />

            <View style={styles.ratingBox}>
                <Text style={styles.ratingTitle}>Keskiarvo:</Text>
                <View style={styles.starsRow}>
                    {renderStars(Math.round(repository.ratingAverage / 20))}
                    <Text style={styles.ratingValue}>
                        {repository.ratingAverage.toFixed(1)} / 100
                    </Text>
                </View>
                <Text style={styles.reviewCount}>
                    {repository.reviewCount} arvostelua
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Arviot</Text>
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.username}>{item.user.username}</Text>
                        <View style={styles.starsRow}>
                            {renderStars(Math.round(item.rating / 20))}
                            <Text style={styles.ratingValueSmall}>{item.rating} / 100</Text>
                        </View>
                        <Text>{item.text}</Text>
                        <Text style={styles.date}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                )}
                onEndReached={handleFetchMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    pageInfo.hasNextPage ? <ActivityIndicator size="small" color="#0366d6" /> : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
    },
    loading: {
        marginTop: 50,
    },
    error: {
        color: "red",
        padding: 16,
    },
    ratingBox: {
        marginTop: 16,
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 8,
    },
    ratingTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    starsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    star: {
        marginRight: 2,
    },
    ratingValue: {
        marginLeft: 8,
        fontWeight: "bold",
    },
    ratingValueSmall: {
        marginLeft: 6,
        color: "#444",
        fontSize: 12,
    },
    reviewCount: {
        color: "#666",
    },
    sectionTitle: {
        marginTop: 24,
        fontWeight: "bold",
        fontSize: 18,
    },
    reviewItem: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 6,
    },
    username: {
        fontWeight: "bold",
        fontSize: 14,
    },
    date: {
        marginTop: 4,
        fontSize: 12,
        color: "#888",
    },
});