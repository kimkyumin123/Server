import { gql } from "apollo-server-express";

export default gql`
type Place{
    id:Int!
    createdAt:String
    updatedAt:String
    title:String!
    address:String!
    zipCode:Int
    x:Float!
    y:Float!
    category:String
    uniqueId:String
    # userId:Int
    # reviews:[Review]
}
type Query{
    placeAbout(placeId:String!):[Review]
}
`