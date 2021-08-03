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
        suggestions:Suggestion
        # password:String! 요구 안할거임.

    }

    type Query{
         dummy:String! #Query Root 권한 issue
    }

`