module.exports = {
    preset: 'react-native',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-community|@testing-library)/)',
    ],
};