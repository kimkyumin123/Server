import { gql } from "apollo-server-express";

export default gql`
    type Mutation{
        updatePlace(id:Int!):MutationResponse
    }
`