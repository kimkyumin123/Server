import { gql } from "apollo-server-express";

export default gql`
    # /**
    #     *가나다라마바사
    #     *
    #     *
    #  */
    type Mutation{
        
        createUser(bio:String,userName:String,gender:String,ageRange:String
        email:String!,nickName:String!,avatar:String,password:String):MutationResponse
    }
` 