import client from "../../client";
import { protectedResolver } from "../users.utils";


const authUserLogoutFN = async(_,{token},{logger,loggedInUser})=>{
    if(loggedInUser===process.env.Invaild_Token){
        return {
            ok:false,
            error:process.env.Invaild_Token
        }
    }else if(loggedInUser===process.env.AccessTokenExpiredError){
        return{
            ok:false,
            error:process.env.AccessTokenExpiredError
        }
    }
    else if(!loggedInUser){
        return{
            ok:false,
            error:process.env.CheckLogin
        }
    }
    const result = await client.token.create({
        data:{
            token
        }
    })
    logger.info(`${__dirname}| %o`,result)
    return{
        ok:true,
        
    }
}
export default {

    Mutation:{
        authUserLogout:protectedResolver(authUserLogoutFN)
    }
}