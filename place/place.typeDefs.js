import { gql } from "apollo-server-express";

export default gql`
type Place{
    id:Int!
    createdAt:String
    updatedAt:String
    title:String!
    address:String!
    zipCode:Int
    x:Int!
    y:Int!
    category:String
    userId:Int
    reviews:[Review]
}
`