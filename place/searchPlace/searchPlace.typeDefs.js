import { gql } from "apollo-server-express";

export default gql`
type Query{
    """
    ---검색된 장소들을 보여줌---
    
    title : 검색 할 장소이름(StartWith)

    category : 검색할 카테고리 분류

    lastId : 페이징처리를 위한 변수이며, 마지막으로 조회했던 Place의 ID
    
    """
    searchPlace(title:String!,category:String,lastId:Int):[Place]
}
`