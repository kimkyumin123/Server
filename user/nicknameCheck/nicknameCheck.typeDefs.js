import { gql } from "apollo-server-express";

export default gql`
    type Query{
        nicknameCheck(payload:String!):QueryResponse!
    }
`