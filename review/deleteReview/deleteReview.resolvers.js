import client from "../../client";
import { protectedResolver } from "../../user/users.utils";

const deleteReviewFN= async(_,{id},{loggedInUser,logger})=>{
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
        const checkUser = await client.review.findFirst({
            where:{
                id
            },select:{
                userId:true
            }
        })
        //글작성자만 지울 수 있음
        if(checkUser.userId!==loggedInUser.id){
            logger.error(`${__dirname}CheckPermission_Review::checkUser::${checkUser.userId} && loggedInUser:${loggedInUser.id}`,)
            return{
                ok:false,
                error:process.env.CheckPermission
            }
        }

        const result = await client.review.delete({
            where:{
                id
            }
        })
        logger.info(`${__dirname}| %o`,result)
        return{
            ok:true
        }
        
    }catch(e){
        logger.error(`${__dirname}|${e}`)
        return {
            ok:false,
            error:process.env.DeleteFail_Review
        }
    }
   
}
export default{
    Mutation:{
        deleteReview:protectedResolver(deleteReviewFN)
    }
}