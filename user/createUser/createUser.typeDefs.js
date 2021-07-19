import { gql } from "apollo-server-express";

export default gql`
    type Mutation{
        createUser(userName:String!,email:String!,nickName:String!,
        PhoneNumber:String,avatar:String,password:String!):MutationResponse
    }
`