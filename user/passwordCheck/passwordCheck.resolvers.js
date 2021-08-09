import { protectedResolver } from "../users.utils"
import bcrypt from "bcrypt"
// 로그인 되어있어야 가능한 체크.
const CheckFn=async(_,{payload},{loggedInUser,logger})=>{
    
    const CheckPassword =await bcrypt.compare(payload,loggedInUser.password)
    console.log(CheckPassword)
    if(CheckPassword){
        return {
            ok:true
        }
    }else{
        logger.error(`${__dirname}__INCORRECT_PASSWORD!! UserName:${loggedInUser.userName}`)
        return{
            ok:false,
            error:process.env.Incorrect_Password
        }
    }

}
export default{
    Mutation:{
        passwordCheck:protectedResolver(CheckFn)
    }
}