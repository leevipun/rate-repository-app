import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useNavigate } from 'react-router-native';
import Text from './Text';
import useAuthStorage from '../hooks/useAuthStorage';
import { useApolloClient } from '@apollo/client';

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

const AppBar = ({ user }) => {
    const navigate = useNavigate();
    const authStorage = useAuthStorage()
    const apolloClient = useApolloClient();

    const handleSignOut = async () => {
        await authStorage.removeAccessToken();
        await apolloClient.resetStore();
    };

    console.log('User in AppBar:', user);

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <Pressable
                    onPress={() => navigate('/')}
                >
                    <Text style={styles.text}>Repositories</Text>
                </Pressable>
                {user && user.me ? (
                    <>
                        <Pressable
                            onPress={() => navigate(`/create-review`)}
                        >
                            <Text style={styles.text}>Create Review</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => navigate(`/reviews/${user.me.id}`)}
                        >
                            <Text style={styles.text}>Your reviews</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handleSignOut()}
                        >
                            <Text style={styles.text}>Sign Out</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Pressable
                            onPress={() => navigate('/signin')}
                        >
                            <Text style={styles.text}>Sign In</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => navigate('/signup')}
                        >
                            <Text style={styles.text}>Sign Up</Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default AppBar;