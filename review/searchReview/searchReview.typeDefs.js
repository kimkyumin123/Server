import { gql } from 'apollo-server-core';

export default gql`
  type Query {
    """
    id -  PK

    title - 리뷰명(Startwith)

    category - 카테고리

    lastId - Pagination처리 변수
    """
    searchReview(id: Int, title: String, category: String, lastId: Int): [Review!]!
  }
`;
