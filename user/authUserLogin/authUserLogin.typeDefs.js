import { gql } from "apollo-server-express";

export default gql`
    type Mutation{
        authUserLogin(email:String!):loginResponse
    }
`