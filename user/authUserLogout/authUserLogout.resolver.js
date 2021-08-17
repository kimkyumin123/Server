import { protectedResolver } from "../users.utils";


const authUserLogoutFN = async(_,__,{loggedInUser})
export default {

    Mutation:{
        authUserLogout:protectedResolver(authUserLogoutFN)
    }
}