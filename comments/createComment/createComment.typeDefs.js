import { gql } from "apollo-server-core";

export default gql`
    type Mutation{
        createComment(payload:String!,reviewId:Int!):MutationResponse
    }
    
`