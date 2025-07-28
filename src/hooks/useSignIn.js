
import { gql, useMutation } from '@apollo/client';

const SIGN_IN_MUTATION = gql`
    mutation SignIn($credentials: AuthenticateInput!) {
        authenticate(credentials: $credentials) {
            accessToken
        }
    }
`


export function useSignIn() {
    const [mutate, result] = useMutation(SIGN_IN_MUTATION);

    const signInUser = async ({ username, password }) => {
        const { data } = await mutate({
            variables: { credentials: { username, password } },
        });
        return data.authenticate.accessToken;
    };

    return [signInUser, result];
}