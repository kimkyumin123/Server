import { gql } from "apollo-server-core";

export default gql`
    type Suggestion{
        id:Int!
        like:Int
        unLike:Int
        reviewId:Int
        userId:Int
    }
    type User{
        id:Int!
        userName:String
        nickName:String!
        email:String!
        avatar:String
        bio:String
        gender:String
        ageRanger:String
        createdAt:String
        updatedAt:String
        reviews:[Review]
        places:[Place]
        platformType:String
        suggestions:[Suggestion]
        comments:[Comment]
        # password:String! 요구 안할거임.

    }

    type Query{
        # 유저에 대한 유효성검사 
        userCheck(email:String,nickName:String,userName:String):QueryResponse
    }


`