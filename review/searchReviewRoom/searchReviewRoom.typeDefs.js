import { gql } from 'apollo-server-core';

export default gql`
  type Query {
    searchReviewRoom(roomId: Int!): reviewRoom
  }
`;
