import client from "../../client"
import { exceptionsHandler } from "../../shared/shard.utils"

export default {
    Query:{
        searchReview:async(_,{id,title,category,lastId},{loggedInUser,logger})=>{
            //유저 유효성검사
            // 현재 Non-Nullable 관련 이슈발생-> 핸들러 처리 수정피료
            const exceptionResult = await  exceptionsHandler(loggedInUser)
            if(exceptionResult!==1){
                logger.error(`${__dirname}|exceptionsHandler ::: |  %o`,exceptionResult)
                return [
                   { "errorCode":exceptionResult}
                ]
            }
            //title 값으로 시작하는 장소 올림차순 정렬 (업데이트날짜 기준)-> result ===null이면 검색결과 없음
            //카테고리별 검색
            try{
                
                if(id){
                    const uniqueReview= await client.review.findUnique({
                        where:{
                            id
                        }
                    })
                    logger.info(`${__dirname}|uniqueReview ::: |  %o`,uniqueReview)
                    return [
                         uniqueReview
                    ]
                    
                }
            const result = await client.review.findMany({
                
                where:{
                    title:{
                        startsWith:title
                    },
                    ...(category &&{category})
                },
                orderBy:{
                    updatedAt:"asc"
                },
                include:{
                    user:true,
                    comments:true,
                    place:true
                },
                take:10,
                skip:lastId?1:0,
                ...(lastId &&{cursor:{id:lastId}})  //cursor => 마지막 요소 저장
                
            })
            
            // logger.info('SearchPlace | %o',result)
            logger.info(`${__dirname}|SearchPlace ::: |  %o`,result)
            
            return result
        }catch(e){
            //트랜잭션 에러
            logger.error(`${__dirname}| %o`,e)
            return  null
        }

            
        }
    }
}