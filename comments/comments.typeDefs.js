import { gql } from "apollo-server-express";

export default gql`
  type Comment {
    "PK"
    id: Int!
    "작성유저"
    user: User!
    "작성유저ID"
    userId: Int!
    "생성날짜"
    createdAt: String!
    "수정날짜"
    updatedAt: String!
    "댓글내용"
    payload: String!
    "해당리뷰"
    review: Review!
    "해당리뷰ID"
    reviewId: Int!
    "해시태그"
    hashtags: [HashTag!]
    "작성자 본인확인"
    isMe: Boolean!
  }
`;
