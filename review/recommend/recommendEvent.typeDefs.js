import { gql } from 'apollo-server-core';

export default gql`
  type Mutation {
    """
    --- 추천기능 구현 ---

    like Then TRUE - 해당 게시글 추천

    like Then False - 해당 게시글 비추천
    """
    recommendEvent(reviewId: Int!, like: Boolean!): MutationResponse
  }
`;
