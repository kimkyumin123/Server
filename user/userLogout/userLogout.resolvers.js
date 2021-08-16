import { protectedResolver } from "../users.utils"

const userLogoutFN=async(_,__,{loggedInUser})=>{

}
export default{
    Mutation:{
        userLogout:protectedResolver(userLogoutFN)
    }
}