import { gql } from "apollo-server-express";

export default gql`
type Mutation{
    deleteReview(id:Int!):MutationResponse
}
`