import { gql } from "apollo-server-core";

export default gql`
    type HashTag{
        id:Int!
        hashTag:String
        createdAt:String
        updatedAt:String
        review:[Review]
        comments:[Comment]
    }

`