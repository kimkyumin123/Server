import { gql } from "apollo-server-express";

export default gql`
    type Mutation{
        createUser(bio:String,userName:String!,gender:String,ageRange:String
        email:String!,nickName:String!,avatar:String,password:String!):MutationResponse
    }
`