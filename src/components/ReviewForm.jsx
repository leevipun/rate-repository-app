import React from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';

const CREATE_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      repositoryId
    }
  }
`;

const validationSchema = Yup.object().shape({
    ownerName: Yup.string()
        .required('Repository owner username is required'),
    repositoryName: Yup.string()
        .required('Repository name is required'),
    rating: Yup.number()
        .required('Rating is required')
        .min(0, 'Rating must be at least 0')
        .max(100, 'Rating must be at most 100'),
    text: Yup.string(), // Optional
});

export default function ReviewForm() {
    const navigate = useNavigate(); // Navigointiin reponäkymään
    const apolloClient = useApolloClient()
    const [createReview] = useMutation(CREATE_REVIEW);

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const { data } = await createReview({
                variables: {
                    review: {
                        ownerName: values.ownerName,
                        repositoryName: values.repositoryName,
                        rating: Number(values.rating),
                        text: values.text,
                    },
                },
            });

            const repositoryId = data?.createReview?.repositoryId;
            await apolloClient.resetStore();
            if (repositoryId) {
                // Ohjaa yksittäisen repositoryn näkymään
                navigate(`/${repositoryId}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{
                ownerName: '',
                repositoryName: '',
                rating: '',
                text: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.container}>
                    <TextInput
                        placeholder="Repository owner"
                        style={styles.input}
                        onChangeText={handleChange('ownerName')}
                        onBlur={handleBlur('ownerName')}
                        value={values.ownerName}
                    />
                    {touched.ownerName && errors.ownerName && <Text style={styles.error}>{errors.ownerName}</Text>}

                    <TextInput
                        placeholder="Repository name"
                        style={styles.input}
                        onChangeText={handleChange('repositoryName')}
                        onBlur={handleBlur('repositoryName')}
                        value={values.repositoryName}
                    />
                    {touched.repositoryName && errors.repositoryName && <Text style={styles.error}>{errors.repositoryName}</Text>}

                    <TextInput
                        placeholder="Rating (0-100)"
                        keyboardType="numeric"
                        style={styles.input}
                        onChangeText={handleChange('rating')}
                        onBlur={handleBlur('rating')}
                        value={values.rating}
                    />
                    {touched.rating && errors.rating && <Text style={styles.error}>{errors.rating}</Text>}

                    <TextInput
                        placeholder="Review"
                        multiline
                        style={[styles.input, { height: 100 }]}
                        onChangeText={handleChange('text')}
                        onBlur={handleBlur('text')}
                        value={values.text}
                    />
                    {touched.text && errors.text && <Text style={styles.error}>{errors.text}</Text>}

                    <Button onPress={handleSubmit} title="Submit Review" disabled={isSubmitting} />
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
    },
    error: {
        color: 'red',
        marginBottom: 4,
    },
});