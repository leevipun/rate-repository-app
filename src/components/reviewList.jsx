import { Button, FlatList, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import useReviews from "../hooks/useReviews";
import Text from "./Text";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigate } from 'react-router-native';

export default function ReviewList({ setId }) {
    const { reviews, loading, refetch, deleteReview, fetchMore, hasNextPage } = useReviews();
    const navigate = useNavigate();

    if (loading) return <Text>Loading...</Text>;

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

    const handleDelete = (id) => {
        Alert.alert("Are you sure you want to delete this review?", "", [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK", onPress: async () => {
                    try {
                        await deleteReview(id);
                    } catch (error) {
                        console.error("Error deleting review:", error);
                    }
                },
            },
        ]);
    };

    const handleViewRepository = (repoId) => {
        setId(repoId);
        navigate(`/${repoId}`);
    };

    const onEndReached = () => {
        if (hasNextPage) {
            fetchMore();
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
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

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() => handleViewRepository(item.repositoryId)}
                            >
                                <Text style={styles.buttonText}>View Repository</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
    starsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    star: {
        marginRight: 2,
    },
    ratingValueSmall: {
        marginLeft: 6,
        color: "#444",
        fontSize: 12,
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
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    viewButton: {
        backgroundColor: "#3b82f6",
        padding: 8,
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: "#ef4444",
        padding: 8,
        borderRadius: 4,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
});