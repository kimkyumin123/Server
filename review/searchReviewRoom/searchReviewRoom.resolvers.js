import client from "../../client"

export default{
    Query:{
        // 검색을 원하는 리뷰룸 ID(PK)를 파라미터로 전달받아 관련 Review들을 보여줄수있음.
        searchReviewRoom:async(_,{roomId},{logger})=>{
            const resultRoom = await client.reviewRoom.findUnique({
                where:{
                    id:roomId
                },
                include:{
                    review:true
                }
            })
            if(!resultRoom){
                logger.error(`${__dirname}|NOTFOUND_RESULTROOM|%o`,resultRoom)
                return null
            }
            console.log(resultRoom)
            logger.info(`${__dirname}|FIND_RESULTROOM|%o`,resultRoom)
            return resultRoom

        }
    }
}