import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginJest from 'eslint-plugin-jest';
import parserBabel from '@babel/eslint-parser';

export default [
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            parser: parserBabel,
            globals: {
                __DEV__: true,
            },
        },
        plugins: {
            react: pluginReact,
            "react-native": pluginReactNative,
            jest: pluginJest,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            ...pluginJest.configs.recommended.rules,

            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
        },
    },
];