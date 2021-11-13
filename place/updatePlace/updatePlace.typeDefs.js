import { gql } from 'apollo-server-express';

export default gql`
  input UpdatePlaceInput {
    id: Int!
    title: String
    address: String
    zipCode: Int
    x: Float
    y: Float
    category: String
    placeId: String
  }
  type Mutation {
    "UpdatePlaceInput - Place JSON DATA"
    updatePlace(place: [UpdatePlaceInput]): MutationResponse
  }
`;
