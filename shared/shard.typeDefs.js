import { gql } from "apollo-server-express";

export default gql`
    type MutationResponse{
        ok:Boolean!,
        error:Int
    },
    type loginResponse{
        ok:Boolean,
        error:String,
        token:String
    }
`