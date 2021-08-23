import client from "../../client";
import { protectedResolver } from "../users.utils";


const authUserLogoutFN = async(_,{token},{logger})=>{
    
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