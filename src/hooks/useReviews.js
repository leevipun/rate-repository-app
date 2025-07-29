import { gql, useQuery, useMutation } from '@apollo/client';

const GET_REPOSITORIES_QUERY = gql`
  query Me {
    me {
      reviews {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            userId
            repositoryId
            rating
            createdAt
            text
            user {
              username
            }
          }
        }
      }
    }
  }
`;

const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($deleteReviewId: ID!) {
    deleteReview(id: $deleteReviewId)
  }
`;

export default function useReviews() {
    const { data, loading, refetch, error, fetchMore } = useQuery(GET_REPOSITORIES_QUERY, {
        fetchPolicy: 'cache-and-network',
    });

    const [deleteReviewMutation] = useMutation(DELETE_REVIEW_MUTATION);

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReviewMutation({
                variables: { deleteReviewId: reviewId },
            });
            refetch(); // päivitä lista
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    };

    const reviews = data?.me?.reviews.edges.map((e) => e.node) || [];
    const pageInfo = data?.me?.reviews.pageInfo || {};

    return {
        reviews,
        loading,
        refetch,
        deleteReview: handleDeleteReview,
        hasNextPage: pageInfo.hasNextPage,
        fetchMore: () => {
            if (pageInfo.hasNextPage) {
                return fetchMore({
                    variables: {
                        after: pageInfo.endCursor,
                    },
                });
            }
        },
    };
}