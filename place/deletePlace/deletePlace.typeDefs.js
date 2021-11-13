import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    "장소삭제 : 장소 PK(ID)로 삭제"
    deletePlace(id: Int!): MutationResponse
  }
`;
