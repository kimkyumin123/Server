import { protectedResolver } from "../users.utils"

const userLogoutFN=async(_,__,{loggedInUser})=>{
    if(loggedInUser){
        return {
            ok:true
        }
    }else{
        return{
            ok:false,
            error:process.env.CheckLogin
        }
    }
}
export default{
    Mutation:{
        userLogout:protectedResolver(userLogoutFN)
    }
}