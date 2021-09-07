import client from "../client"

export default{
    Query:{
        //로그인체크?=> 일단 X  
        
        placeAbout:async(_,{placeId,lastId},{logger})=>{
            //해당 장소 유효성 검사 
            try{
                const placeResult = await client.place.findUnique({
                    where:{
                        uniqueId:placeId
                    }
                })
                if(!placeResult){
                    logger.error(`${__dirname}|NotFound Place::${placeId}`)
                    return{
                        ok:false,
                        error:process.env.NotFound_Place
                    }
                }
            }catch(e){
                logger.error(`${__dirname}|%o`,e)
                return{
                    ok:false,
                    error:process.env.Transaction_ERROR
                }
            }
            //해당 장소에 대한 리뷰 검색
            try{
                const reviewResult = await client.review.findMany({
                    where:{
                        placeId:placeResult.id
                    },
                    orderBy:{
                        updatedAt:"asc"
                    },
                    take:10,
                    skip:lastId?1:0,
                    ...(lastId &&{cursor:{id:lastId}})  //cursor => 마지막 요소 저장
                    
                })
                logger.info(`${__dirname}|%o`,reviewResult)
                return reviewResult

             }catch(e){
                 logger.error(`${__dirname}|%o`,e)
                 return{
                     ok:false,
                     error:process.env.Transaction_ERROR
                 }
             }
            
            
            
            
            
        }
    }

}