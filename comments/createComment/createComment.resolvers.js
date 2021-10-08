import client from "../../client";
import { protectedResolver } from "../../user/users.utils";

const createCommentFN= async(_,{payload,reviewId},{loggedInUser,logger})=>{

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
    //게시글 확인
    const reviewResult = await client.review.findUnique({
        where:{id:reviewId}
    })
    if(!reviewResult){
        //에러핸들링
        logger.error(`${__dirname}|NOTFOUND_REVIEWID|%o`,reviewId)
        return{

        }
    }
    // 댓글생성
    try{
        const resultComent = await client.comment.create({
            data:{
                payload,
                review:{
                    connect:{
                        id:reviewId
                    }
                },
                user:{
                    connect:{
                        id:loggedInUser.id
                    }
                }
            }

        })
    return{
        ok:true
    }

    }catch(e){
        logger.error(`${__dirname}|TRANSECTION_ERROR|%o`,e)
        return{
            ok:false,
            error:process.env.Transaction_ERROR
        }
    }


}
export default{

    createComment:protectedResolver(createCommentFN)
}