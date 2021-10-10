import client from "../../client"
import { exceptionsHandler } from "../../shared/shard.utils"
import { protectedResolver } from "../users.utils"

const userLogoutFN=async(_,__,{loggedInUser,logger,token})=>{
    const exceptionResult = await  exceptionsHandler(loggedInUser)
    if(exceptionResult!==1){
        return{
            ok:false,
            error:exceptionResult
        }
    }
    const result = await client.token.create({
        data:{
            token
        }
    })
    logger.info(`${__dirname}| %o`,result)
    return {
        ok:true
    }
}
export default{
    Mutation:{
        userLogout:protectedResolver(userLogoutFN)
    }
}