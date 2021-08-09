import { gql } from "apollo-server-express";

export default gql`
    scalar Upload
    type MutationResponse{
        ok:Boolean!,
        error:Int
    },
    type loginResponse{
        ok:Boolean,
        error:String,
        token:Token
    }
    type Token{
        accessToken:String!,
        refreshToken:String!
    }
`