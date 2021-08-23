import client from "../../client"

export default {
    Query:{
        searchPlace:async(_,{title,page},{logger})=>{
            //title 값으로 시작하는 장소 올림차순 정렬 (업데이트날짜 기준)-> result ===null이면 검색결과 없음
            const result = await client.place.findMany({
                
                where:{
                    title:{
                        startsWith:title
                    }
                },
                orderBy:{
                    updatedAt:"asc"
                },
                take:10,
                skip:(page-1)*10, 
                
            })
            
            // logger.info('SearchPlace | %o',result)
            logger.info(`${__dirname}| %o`,result)
            
            return result
        }
    }
}