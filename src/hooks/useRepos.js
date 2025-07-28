import { gql, useQuery } from '@apollo/client';

const GET_REPOSITORIES_QUERY = gql`
    query {
        repositories {
            edges {
                node {
                    id
                    ownerName
                    name
                    createdAt
                    fullName
                    ratingAverage
                    reviewCount
                    stargazersCount
                    watchersCount
                    forksCount
                    openIssuesCount
                    url
                    ownerAvatarUrl
                    description
                    language
                    userHasReviewed
                }
            }
        }
    }
`;

const useRepositories = () => {
    const { data, loading, refetch, error } = useQuery(GET_REPOSITORIES_QUERY, {
        fetchPolicy: 'cache-and-network',
    });

    if (error) {
        console.error('Error fetching repositories:', error);
    }

    console.log('Repositories data:', data);

    return {
        repositories: data?.repositories,
        loading,
        refetch,
    };
};

export default useRepositories;