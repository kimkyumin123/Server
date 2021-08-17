import { gql } from "apollo-server-express";

export default gql`
    scalar Upload
    type MutationResponse{
        ok:Boolean!,
        error:Int
    },
    type loginResponse{
        ok:Boolean,
        error:Int,
        token:Token
    },
    type QueryResponse{
        ok:Boolean!,
        error:Int
    }
    type Token{
        accessToken:String!,
        refreshToken:String!
    }
`