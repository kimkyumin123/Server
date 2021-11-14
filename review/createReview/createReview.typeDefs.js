import { gql } from 'apollo-server-express';

export default gql`

    input ReviewInput{
        title:String!,
        content:String!,
        place:InputPlace!
        hashtags:String
    }

    input ReviewUpload{
        upload:Upload!
    }
    type Mutation{
        # 추후 place 변경
        createReview(review:[ReviewInput!]!,upload:[ReviewUpload!]!):MutationResponse
    }
`
