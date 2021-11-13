import { gql } from 'apollo-server-core';

export default gql`
  type Query {
    searchComment(id: Int, payload: String): [Comment]
  }
`;
