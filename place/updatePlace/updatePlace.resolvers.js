import { protectedResolver } from "../../user/users.utils";


const updatePlaceFN= async(_,{id},{logger,loggedInUser})=>{
    if(loggedInUser===process.env.AccessTokenExpiredError){
        return{
            ok:false,
            error:process.env.AccessTokenExpiredError
        }

    }
    else if(loggedInUser===process.env.Invaild_Token){
        return{
            ok:false,
            error:process.env.Invaild_Token
        }
    }
    else if(!loggedInUser){
        return{
            ok:false,
            error:process.env.CheckLogin
        }
    }

    
}
export default{
    Mutation:{
        updatePlace:protectedResolver(updatePlaceFN)
    }
}