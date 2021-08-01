import { gql } from "apollo-server-express";
//패스워드 변경은 따로구현
export default gql`
    type Mutation{
        editUser(nickName:String,bio:String,avatar:Upload,
        gender:String,ageRange:String):MutationResponse
    }
`