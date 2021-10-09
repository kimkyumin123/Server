import { gql } from "apollo-server-core";

export default gql`
    type HashTag{
        "PK"
        id:Int!
        "Content"
        hashTag:String
        "생성날짜"
        createdAt:String
        "수정날짜"
        updatedAt:String
        "관련리뷰"
        review:[Review]
        "관련댓글"
        comments:[Comment]
    }

`