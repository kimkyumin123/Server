import { gql } from "apollo-server-core";

export default gql`
    type Mutation{
        updateComment(id:Int!,payload:String!):MutationResponse
    }
`