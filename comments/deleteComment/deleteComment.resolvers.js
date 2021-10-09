import client from "../../client";
import { protectedResolver } from "../../user/users.utils";


const deleteCommentFN=async(_,{id},{loggedInUser,logger})=>{
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
    try{
        const result = await client.comment.findUnique({
            where:{
                id
            }
        })
    
        //해당 댓글작성자와 현재 로그인 유저가 같다면 삭제
        if(result.userId!==loggedInUser.id){
            logger.error(`${__dirname}| USER_NOTMATCHED!! | paramId:${result.userId}, loggedInUser:${loggedInUser.id}`,)
            return{
                ok:false,
                error:process.env.UserNotMatched
            }
        }

        const deleteResult = await client.comment.delete({
            where:{
                id
            }
        })
        return{
            ok:true
        }
    }catch(e){
        logger.error(`${__dirname}|TRANSECTIONERROR|%e`,e)
    }
}
export default{
    Mutation:{
        deleteComment:protectedResolver(deleteCommentFN)
    }
}