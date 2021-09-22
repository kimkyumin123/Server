import client from "../client";

export default{
    Review:{
        likes:({id})=> client.suggestion.count({ //좋아요수
                where:{
                    reviewId:id,
                    like:true
             
                }}),
        unLikes:({id})=> client.suggestion.count({where:{reviewId:id,unLike:true}}) //싫어요 수 
    }
}