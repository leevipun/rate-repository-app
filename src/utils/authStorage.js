import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
    constructor(namespace = 'auth') {
        this.namespace = namespace;
        this.tokenKey = `${namespace}:accessToken`;
    }

    async getAccessToken() {
        try {
            const token = await AsyncStorage.getItem(this.tokenKey);
            return token;
        } catch (e) {
            console.error('Failed to get access token:', e);
            return null;
        }
    }

    async setAccessToken(accessToken) {
        try {
            await AsyncStorage.setItem(this.tokenKey, accessToken);
        } catch (e) {
            console.error('Failed to save access token:', e);
        }
    }

    async removeAccessToken() {
        try {
            await AsyncStorage.removeItem(this.tokenKey);
        } catch (e) {
            console.error('Failed to remove access token:', e);
        }
    }
}

export default AuthStorage;