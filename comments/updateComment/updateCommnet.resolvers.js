import client from "../../client";
import { processHashtags } from "../../hashtag/hashtag.utils";
import { protectedResolver } from "../../user/users.utils";

const updateCommentFN=async(_,{id,payload},{loggedInUser,logger})=>{
    //유저 유효성검사
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
    // 댓글 유효성검사
    try{
        const existComment = await client.comment.findUnique({
            where:{
                id
            },
            select:{
                hashtags:{
                    select:{
                        hashtag:true
                    }
                }
            }
        })
        // 댓글 존재하지 않음
        if(!existComment){
            //Error Handling
            logger.error(`${__dirname}|NOTFOUND_COMMENTID|%o`,id)
            //에러코드 업데이트 필요
            return{
                ok:false,
                error:-0
            }
        }
        console.log(existComment.hashtags)
        // 댓글 업데이트 
        const result = await client.comment.update({
        where:{
            id
        },
        data:{
            payload,
            //해시태그 재참조
            hashtags:{
                disconnect:existComment.hashtags,
                connectOrCreate:processHashtags(payload)
            }   
        }
        })
        logger.info(`${__dirname}|UpdateCOMMENT:|%o`,result)
        return{
            ok:true
        }

    }catch(e){
        logger.error(`${__dirname}|TRANSECTIONERROR|%o`,e)
        return{
            ok:false,
            error:process.env.Transaction_ERROR
        }
    }


}

export default {
    Mutation:{
        updateComment:protectedResolver(updateCommentFN)
    }

}