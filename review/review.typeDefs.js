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
        "해당 유저정보"
        user:User
        "구현예정"
        comments:[Comment]
        "추천"
        suggestions:Suggestion
        "장소 PK"
        placeId:Int
        "장소"
        place:Place
        "좋아요 수"
        getLikes:Int
        "싫어요 수 "
        getUnLikes:Int
        "좋아요 상태"
        isLike:Boolean
        "싫어요 상태"
        isUnLike:Boolean
        "해시태그 "
        hashtags:[HashTag]
    } 
    type reviewRoom{
        "PK"
        id:Int!
        "생성날짜"
        createdAt:String
        "수정날짜"
        updatedAt:String
        "해당리뷰"
        review:[Review]
    }


`