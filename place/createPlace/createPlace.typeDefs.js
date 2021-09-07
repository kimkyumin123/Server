import { gql } from "apollo-server-express";

export default gql`
    input InputPlace{
        title:String!
        address:String!
        zipCode:Int
        x:Float!
        y:Float!
        category:String
        placeId:String!

    }
    type Mutation{
        createPlace(
            place:[InputPlace]
        ):MutationResponse
    }
`