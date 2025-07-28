import React, { useContext } from 'react';
import { useFormik } from "formik";
import { Button, Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import * as Yup from 'yup';
import { useSignIn } from '../hooks/useSignIn';
import useAuthStorage from '../hooks/useAuthStorage';
import { useNavigate } from 'react-router-native';
import { useApolloClient } from '@apollo/client';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});


const SignIn = () => {
    const authStorage = useAuthStorage();
    const apolloClient = useApolloClient(); // <-- Käytä kontekstia authStorage
    const navigate = useNavigate();
    const [signInUser, result] = useSignIn(); // <-- Käytä hookkia, älä suoraa importtia
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit: async values => {
            try {
                console.log('Signing in with:', values);
                const accessToken = await signInUser({
                    username: values.username,
                    password: values.password,
                });
                await authStorage.setAccessToken(accessToken); // <-- Set access token using authStorage
                apolloClient.resetStore();
                navigate("/"); // <-- Call useNavigate function
            } catch (error) {
                console.error('Login failed:', error);
            }
        },
    });

    const onSubmit = () => {
        formik.handleSubmit();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Welcome Back 👋</Text>

                <TextInput
                    placeholder="Username"
                    style={styles.input}
                    onChangeText={formik.handleChange('username')}
                    onBlur={formik.handleBlur('username')}
                    value={formik.values.username}
                    autoCapitalize="none"
                />
                {formik.touched.username && formik.errors.username && (
                    <Text style={styles.error}>{formik.errors.username}</Text>
                )}

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                    <Text style={styles.error}>{formik.errors.password}</Text>
                )}

                <View style={styles.buttonWrapper}>
                    <Button
                        title="Sign In"
                        color="#0366d6"
                        onPress={onSubmit}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fb',
        justifyContent: 'center',
    },
    inner: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 32,
        color: '#1a1a1a',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 14,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 13,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    buttonWrapper: {
        marginTop: 12,
        width: '100%',
    },
});

export default SignIn;