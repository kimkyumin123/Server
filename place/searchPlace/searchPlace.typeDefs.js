import { gql } from "apollo-server-express";

export default gql`
type Query{
    searchPlace(title:String!,category:String,lastId:Int):[Place]
}
`