import client from "../client";

export default{
    Review:{
        likes:({id})=> client.suggestion.count({ //좋아요수
                where:{
                    reviewId:id,
                    like:true
             
                }}),
        unLikes:({id})=> client.suggestion.count({where:{reviewId:id,unLike:true}}), //싫어요 수 
        isLike:async({id},_,{loggedInUser,logger})=>{
            const whereLike={
                reviewId_userId:{
                    userId:loggedInUser.id,
                    reviewId:id
                }
            }
            const result = await client.suggestion.findUnique({
                where:whereLike,
                select:{
                    like:true
                }
            })
            logger.info(`${__dirname}|isLike : %o`,result)
            if(!result){
                return false
            }
            return true
           

        },
        isUnLike:async({id},_,{loggedInUser,logger})=> {
            const whereLike={
                reviewId_userId:{
                    userId:loggedInUser.id,
                    reviewId:id
                }
            }
            const result = await client.suggestion.findUnique({
                where:whereLike,
                select:{
                    unLike:true
                }
            })
            logger.info(`${__dirname}|isUnLike : %o`,result)
            if(!result){
                return false
            }
            return true
        }
    }
}