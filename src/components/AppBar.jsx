import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useNavigate } from 'react-router-native';
import Text from './Text';

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#24292e',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: 100,
        width: '100%',
    },
    text: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 20,
        textAlign: 'left',
        width: '100%',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'System',
        // fontFamily: 'Arial', // Uncomment if you want to use a specific font
    },
    // ...
});

const AppBar = () => {
    const navigate = useNavigate();

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <Pressable
                    onPress={() => navigate('/')}
                >
                    <Text style={styles.text}>Repositories</Text>
                </Pressable>
                <Pressable
                    onPress={() => navigate('/signin')}
                >
                    <Text style={styles.text}>Sign In</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default AppBar;