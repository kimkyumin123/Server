import { gql } from "apollo-server-express";

export default gql`
    type Review{
        id:Int!
        createdAt:String
        updatedAt:String
        title:String
        content:String
        upload:Upload
        userId:Int
        comments:[Comment]
        suggestions:Suggestion
        placeId:Int
        place:Place
        likes:Int
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