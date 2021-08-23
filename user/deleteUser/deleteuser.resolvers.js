import client from "../../client";
import { protectedResolver } from "../users.utils";


const deleteFn =async(_,__,{loggedInUser,logger})=>{
    //Check Login
           if(!loggedInUser){
               return{
                   ok:false,
                   error:process.env.CheckLogin
               }
           }
    // 일반유저 Auth유저 공통 -> 이메일 제거 
    try{
       const result= await client.user.delete({
            where:{
                email:loggedInUser.email
            }
        })
        logger.info(`${__dirname}| %o`,result)
    }catch(e){
        logger.error(__dirname,e)
    }
    return{
        ok:true,
        
    }
           
}   
export default {


    Mutation:{
        
        deleteUser:protectedResolver(deleteFn)
    }

}