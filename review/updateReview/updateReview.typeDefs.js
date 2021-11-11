import { gql } from "apollo-server-express";

export default gql`
    input UpdateReviewInput{
        id:Int!,
        title:String,
        
        content:String,
        place:InputPlace,
        
}
    input UpdateUploadInput{
        upload:Upload,
    }

    type Mutation{
        updateReview(
            review:[UpdateReviewInput!]!,
            upload:[UpdateUploadInput!]!
        ):MutationResponse!
    }
`