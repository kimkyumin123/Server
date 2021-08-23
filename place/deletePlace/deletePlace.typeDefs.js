import { gql } from "apollo-server-express";

export default gql`
type Mutation{
    deletePlace(id:Int!):MutationResponse
}
`