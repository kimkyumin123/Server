import client from "../../client";
import { protectedResolver } from "../users.utils";


const authUserLogoutFN = async(_,{token},{logger})=>{
    
    const result = await client.token.create({
        data:{
            token
        }
    })
    console.log(result)
    return{
        ok:true,
        
    }
}
export default {

    Mutation:{
        authUserLogout:protectedResolver(authUserLogoutFN)
    }
}