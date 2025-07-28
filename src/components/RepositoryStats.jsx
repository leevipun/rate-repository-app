import { View, StyleSheet } from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
    container: {
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

const RepositoryStats = ({ forks, stars, rating, reviews }) => {
    const Stat = ({ value, label }) => (
        <View style={styles.statItem}>
            <Text fontWeight="bold">{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stat value={forks} label="Forks" />
            <Stat value={stars} label="Stars" />
            <Stat value={rating} label="Rating" />
            <Stat value={reviews} label="Reviews" />
        </View>
    );
};

export default RepositoryStats;