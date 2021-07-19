import { gql } from "apollo-server-express";

export default gql`
    type authResponse{
        ok:Boolean!,
        error:String,
        profile_image_url:String,
        nickname:String,
        gender:String,
        age_range:String

    }
    type Mutation{
        authVaildation:authResponse
    }

`