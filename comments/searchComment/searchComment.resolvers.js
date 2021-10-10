import client from "../../client"

export default {
    Query:{
        searchComment:async(_,{id,payload},{logger})=>{
            /* ====================댓글 검색 =====================
                1. ID(PK) 검색 - 댓글 ID로 검색
                2. 댓글 내용 검색 - 해당 String으로 시작하는 댓글 전체 검색 
                3. ID && 댓글 내용 검색 - 해당 댓글 ID가 해당 String으로 시작하는지 검색
            ====================================================*/
            try{
                
                const CommentResult = await client.comment.findMany({
                    where:{
                        ...(id &&{id}),
                        ...(payload&&{
                            payload:{startsWith:payload}
                        })
                    },
                    include:{
                        review:true,
                        user:true
                    }
                })
                logger.error(`${__dirname}|CommentResult ::: | %o`,CommentResult)
                return CommentResult
            }catch(e){
                logger.error(`${__dirname}|TRANSECTION_ERROR| %o`,e)
                return process.env.Transaction_ERROR
            }
       
        }
    }

}