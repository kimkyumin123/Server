import { gql } from "apollo-server-core";

export default gql`
  type Query {
    """
    해당장소에 대한 리뷰출력을 위한 뮤테이션

    placeId - VWorld_UniqueID

    lastId - Pagination처리를 위함(해당Id 이후 항목 전달)
    """
    aboutPlaceReview(placeId: String!, lastId: Int): [Review!]!
  }
`;
