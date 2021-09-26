import { gql } from "apollo-server-express";

export default gql`
    type Review{
        "PK"
        id:Int!
        "생성날짜"
        createdAt:String
        "수정날짜"
        updatedAt:String
        "제목"
        title:String
        "내용"
        content:String
        "사진"
        upload:Upload
        "생성유저ID"
        userId:Int
        "구현예정"
        comments:[Comment]
        "추천"
        suggestions:Suggestion
        "장소 PK"
        placeId:Int
        "장소"
        place:Place
        "좋아요 수"
        likes:Int
        "싫어요 수 "
        unLikes:Int
        #hashtags:[HashTag]
    } 
    type HashTag{
        id:Int!
        hashTag:String
        createdAt:String
        updatedAt:String
    }

`