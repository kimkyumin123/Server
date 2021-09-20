import { gql } from "apollo-server-core";

export default gql`
    type Mutation{
        toggleLike(reviewId:Int!,like:Boolean!):MutationResponse

    }
`