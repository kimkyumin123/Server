import { gql } from "apollo-server-express";

export default gql`

    input ReviewInput{
        title:String!,
        upload:Upload,
        content:String!,
        place:InputPlace
        hashtags:String
    }
    type Mutation{ 
        # 추후 place 변경
        createReview(review:[ReviewInput]):MutationResponse
    }
`