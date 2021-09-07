import { gql } from "apollo-server-core";

export default gql`
    type Query{
        searchReview(title:String):[Review]
    }
`