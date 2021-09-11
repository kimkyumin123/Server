import client from "../../client"

export default{
    Query:{
        aboutPlaceReview:async(_,{placeId,lastId},{logger})=>{
            const placeResult = await client.place.findUnique({
                where:{
                    uniqueId:placeId
                }
            })
            logger.info(`${__dirname}| %o`,placeResult)
            //장소없을시
            if(!placeResult){
                logger.error(`${__dirname}|NOTFOUND ::: %o`,placeResult)
                return null
            }
            try{
                
                const reviewResult = await client.review.findMany({
                    where:{
                    placeId:placeResult.id,
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
                return null
            }
           
    

        }
    }

}