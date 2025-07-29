import React, { useReducer, useState, useEffect } from 'react';
import {
    FlatList,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import RepositoryListItem from './RepositoryListItem';
import useRepositories from '../hooks/useRepos';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    separator: { height: 10, backgroundColor: '#e1e4e8' },
    headerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#1c1c1e',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#d1d1d6',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#1c1c1e',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d1d6',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f2f2f7',
    },
    dropdownText: { fontSize: 16, color: '#333' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        elevation: 5,
    },
    optionItem: { paddingVertical: 12, paddingHorizontal: 16 },
    optionText: { fontSize: 16, color: '#1c1c1e' },
});

const ORDER_OPTIONS = [
    { label: 'Latest Repositories', value: 'latest' },
    { label: 'Highest Rated', value: 'highest' },
    { label: 'Lowest Rated', value: 'lowest' },
    { label: 'Most Reviews', value: 'most' },
];

const RepositoryList = ({ setId }) => {
    const [repositories, setRepositories] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
    const [searchQuery, setSearchQuery] = useState('');

    const { repositories: fetchedRepositories } = useRepositories();

    useEffect(() => {
        if (fetchedRepositories) {
            const newRepositories = fetchedRepositories.edges.map(edge => edge.node);
            setRepositories(newRepositories);
        }
    }, [fetchedRepositories]);

    const handleSortChange = (option) => {
        setSelectedOption(option);
        let sortedRepositories = [...repositories];
        switch (option.value) {
            case 'latest':
                sortedRepositories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'highest':
                sortedRepositories.sort((a, b) => b.ratingAverage - a.ratingAverage);
                break;
            case 'lowest':
                sortedRepositories.sort((a, b) => a.ratingAverage - b.ratingAverage);
                break;
            case 'most':
                sortedRepositories.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            default:
                break;
        }
        setRepositories(sortedRepositories);
    };

    const filteredRepositories = repositories.filter((repo) =>
        repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCount = (count) => {
        return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
    };

    const RepositoryListHeader = () => {
        const [modalVisible, setModalVisible] = useState(false);

        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerLabel}>Search repositories</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Type to search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />

                <Text style={styles.headerLabel}>Order repositories by</Text>

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.dropdownButton}
                >
                    <Text style={styles.dropdownText}>
                        {selectedOption?.label || 'Select an option'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#333" />
                </TouchableOpacity>

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setModalVisible(false)}
                        activeOpacity={1}
                    >
                        <View style={styles.modalContent}>
                            <FlatList
                                data={ORDER_OPTIONS}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => handleSortChange(item)}
                                    >
                                        <Text style={styles.optionText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    };

    return (
        <FlatList
            data={filteredRepositories}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
                <RepositoryListItem
                    repository={item}
                    formatCount={formatCount}
                    setId={setId}
                />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<RepositoryListHeader />}
        />
    );
};

export default RepositoryList;