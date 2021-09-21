import client from "../../client";
import { protectedResolver } from "../../user/users.utils";

// 전달받은 like가 true일경우 == 추천
// 전달받은 like가 false일경우 == 비추천
const toggleLikeFN = async(_,{reviewId,like},{loggedInUser,logger})=>{
    if(loggedInUser===process.env.AccessTokenExpiredError){
        logger.error(`${__dirname}|AccessTokenExpiredError`)
        return{
            ok:false,
            error:process.env.AccessTokenExpiredError
        }

    }
    else if(loggedInUser===process.env.Invaild_Token){
        logger.error(`${__dirname}|Invaild_Token`)
        return{
            ok:false,
            error:process.env.Invaild_Token
        }
    }
    else if(!loggedInUser){
        logger.error(`${__dirname}|UserNotFound`)
        return{
            ok:false,
            error:process.env.CheckLogin
        }
    }
    //좋아요 싫어요 따로 구현
    try{
        const reviewResult = await client.review.findUnique({
            where:{id:reviewId}
        })
        if(!reviewResult){
            return{
                ok:false,
            
            }
        }
        // 좋아요 싫어요 구분
     
        const whereLike={
            reviewId_userId:{
                userId:loggedInUser.id,
                reviewId
            }
        }
        const suggestionResult = await client.suggestion.findUnique({
            where:whereLike
        })
        logger.info(`${__dirname}|FindSuggestion::%o`,suggestionResult)
        //like is true or false
        if(like){  // 추천
            if(suggestionResult){ // 유저데이터가 있을경우
           
                if(suggestionResult.like && !suggestionResult.unLike){     // 둘다 false가 되면 delete
                    const deleteSuggestion = await client.suggestion.delete({
                        where:{
                            id:suggestionResult.id
                        }
                    })
                    logger.info(`${__dirname}|DeleteSuggestion::%o`,deleteSuggestion)
                }
                else{   // unLike가 false가 아닐경우
                
                const updateSuggestion = await client.suggestion.update({
                    where:{
                        id:suggestionResult.id
                    },
                    data:{
                        like:!suggestionResult.like
                    }
                })
                logger.info(`${__dirname}|UpdateSuggestion::%o`,updateSuggestion)
                }
            }else{ // 해당 유저 없을경우 추천 OR 비추천 실행
                const createSuggestion = await client.suggestion.create({
                    data:{
                        review:{
                            connect:{
                                id:reviewId
                            }
                        },
                        user:{
                            connect:{
                                id:loggedInUser.id
                            }
                        },
                        like:true   
                    }
                })
                logger.info(`${__dirname}|createSuggestion::%o`,createSuggestion)
            }
            // 응답 완료코드 전달
            return {
                ok:true,
            }
        }else{//비추천
            // 해당 유저 비추천기능 중복검사
            if(suggestionResult){// 이미 되어있을경우 추천 false
                if(suggestionResult.unLike && !suggestionResult.like){   //추천도 false일경우 필드삭제         
                    const deleteSuggestion = await client.suggestion.delete({
                        where:{
                            id:suggestionResult.id
                        }
                    })
                    logger.info(`${__dirname}|DeleteSuggestion::%o`,deleteSuggestion)
                }else{  // 추천이 True일경우는 업데이트
                  
                    const updateSuggestion = await client.suggestion.update({
                        where:{
                            id:suggestionResult.id
                        },
                        data:{
                            unLike:!suggestionResult.unLike
                        }
                    })
                    logger.info(`${__dirname}|UpdateSuggestion::%o`,updateSuggestion)
                }
      
              
            }else{  // 해당 유저 없을경우 추천 OR 비추천 실행
              
                const createSuggestion = await client.suggestion.create({
                    data:{
                        review:{
                            connect:{
                                id:reviewId
                            }
                        },
                        user:{
                            connect:{
                                id:loggedInUser.id
                            }
                        },
                        unLike:true   
                    }
                })
                logger.info(`${__dirname}|createSuggestion::%o`,createSuggestion)
            }
            return{
                ok:true
            }
        }



    }catch(e){
        logger.error(`${__dirname}| %o`,e)
        return{
            ok:false
        }
    }
    

}
export default {
    Mutation:{
        toggleLike:protectedResolver(toggleLikeFN)
    }

}