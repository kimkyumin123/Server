import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    userLogin(userName: String!, password: String!): loginResponse
  }
`;
