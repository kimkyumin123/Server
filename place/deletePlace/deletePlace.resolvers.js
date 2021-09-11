import client from "../../client";
import { protectedResolver } from "../../user/users.utils";

const deletePlaceFN= async(_,{id},{loggedInUser,logger})=>{
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
        const result = await client.place.delete({
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
            error:process.env.DeleteFail_Place
        }
    }
   
}
export default{
    Mutation:{
        deletePlace:protectedResolver(deletePlaceFN)
    }
}