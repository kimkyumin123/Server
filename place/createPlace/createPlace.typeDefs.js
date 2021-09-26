import { gql } from "apollo-server-express";

export default gql`

    type Mutation{
        "실제 사용하지 않는 뮤테이션이며 임의로 추가할 장소가 있을시 호출합니다."
        createPlace(
            place:[InputPlace]
        ):MutationResponse
    }
`