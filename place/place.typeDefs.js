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
type Place{
    "PK"
    id:Int!
    "생성날짜"
    createdAt:String!
    "수정날짜"
    updatedAt:String!
    "제목"
    title:String!
    "주소"
    address:String!
    "우편번호"
    zipCode:Int
    "x 좌표"
    x:Float!
    "y 좌표"
    y:Float!
    "카테고리"
    category:String
    "VWorld Unique ID"
    uniqueId:String
    # userId:Int
    # reviews:[Review]
}
type Query{
    placeAbout(placeId:String!):[Review]
}
`