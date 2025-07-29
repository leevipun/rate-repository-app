import { Formik } from 'formik';
import * as Yup from 'yup';
import { useApolloClient, useMutation } from '@apollo/client';
import { useSignIn } from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { gql } from '@apollo/client';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import useAuthStorage from '../hooks/useAuthStorage';

export const CREATE_USER = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      username
    }
  }
`;

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required')
        .min(5, 'Username must be at least 5 characters')
        .max(30, 'Username must be at most 30 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(5, 'Password must be at least 5 characters')
        .max(50, 'Password must be at most 50 characters'),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
});

const initialValues = {
    username: '',
    password: '',
    passwordConfirmation: '',
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
});

const SignUpForm = () => {
    const [createUser] = useMutation(CREATE_USER);
    const authStorage = useAuthStorage();
    const apolloClient = useApolloClient();
    const [signInUser, result] = useSignIn(); // <-- Käytä hookkia, älä suoraa importtia
    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting, setErrors }) => {
        const { username, password } = values;
        try {
            await createUser({ variables: { user: { username, password } } });
            const accessToken = await signInUser({
                username: values.username,
                password: values.password,
            });
            await authStorage.setAccessToken(accessToken); // <-- Set access token using authStorage
            apolloClient.resetStore();
            navigate("/"); // <-- Call useNavigate function
        } catch (e) {
            setErrors({ username: 'Registration failed' });
            console.error(e);
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.container}>
                    <TextInput
                        placeholder="Username"
                        style={styles.input}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                    />
                    {touched.username && errors.username && (
                        <Text style={styles.error}>{errors.username}</Text>
                    )}

                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                    />
                    {touched.password && errors.password && (
                        <Text style={styles.error}>{errors.password}</Text>
                    )}

                    <TextInput
                        placeholder="Password Confirmation"
                        style={styles.input}
                        onChangeText={handleChange('passwordConfirmation')}
                        onBlur={handleBlur('passwordConfirmation')}
                        value={values.passwordConfirmation}
                        secureTextEntry
                    />
                    {touched.passwordConfirmation && errors.passwordConfirmation && (
                        <Text style={styles.error}>{errors.passwordConfirmation}</Text>
                    )}

                    <Button onPress={handleSubmit} title="Sign up" disabled={isSubmitting} />
                </View>
            )}
        </Formik>
    );
};

export default SignUpForm;