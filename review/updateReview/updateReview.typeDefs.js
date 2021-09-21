import { gql } from "apollo-server-express";

export default gql`
    input UpdateReviewInput{
        title:String!,
        upload:Upload,
        content:String!,
        place:InputPlace
}

    type Mutation{
        updateReview(
            review:[UpdateReviewInput]
        ):MutationResponse
    }
`