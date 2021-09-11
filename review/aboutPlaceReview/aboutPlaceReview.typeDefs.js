import { gql } from "apollo-server-core";

export default gql`
    type Query{
        aboutPlaceReview(placeId:String!,lastId:Int):[Review]
    }
`