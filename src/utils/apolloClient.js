import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';

const apiUrl = Constants?.manifest?.extra?.apiUrl ?? Constants?.expoConfig?.extra?.apiUrl;

const createApolloClient = () => {
    return new ApolloClient({
        uri: apiUrl,
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;