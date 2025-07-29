import { StyleSheet, View } from 'react-native';

import { Route, Routes, Navigate, useNavigate } from 'react-router-native';

import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';
import SignIn from './SignIn';
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import SingleRepo from './SingleRepo';
import ReviewForm from './ReviewForm';
import SignUpForm from './SignUp';
import ReviewList from './reviewList';

const ME_QUERY = gql`
    query Query {
        me {
            username
            id
        }
    }
`;

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.mainBackground,
        flexGrow: 1,
        flexShrink: 1,
    },
});



const Main = () => {
    const [id, setId] = useState(null);
    const { data } = useQuery(ME_QUERY, {
        fetchPolicy: 'cache-and-network',
    });
    const navigate = useNavigate()

    useEffect(() => {
        if (data?.me === null) {
            navigate('/signin');
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <AppBar user={data} />
            <Routes>
                <Route path="/" element={<RepositoryList setId={setId} />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/:id" element={<SingleRepo id={id} />} />
                <Route path="/create-review" element={<ReviewForm />} />
                <Route path='/signup' element={<SignUpForm />} />
                <Route path="/reviews/:id" element={<ReviewList setId={setId} />} />
            </Routes>
        </View>
    );
};

export default Main;