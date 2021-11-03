import client from "../client"
import { userCheck } from "./users.utils"

export default{
    Query:{
        userCheck:async(_,{nickName,email,userName},{logger})=>{
            const result  =await userCheck(userName,nickName,email)
            console.log(result)
            if(result){
                return{
                    ok:false,
                    error:result
                }
            }
            return {
                ok:true,

            }
          
        }
    },

}

