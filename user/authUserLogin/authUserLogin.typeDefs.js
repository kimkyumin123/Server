import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    authUserLogin(platform_type: String!, accesstoken: String!): loginResponse
  }
`;
