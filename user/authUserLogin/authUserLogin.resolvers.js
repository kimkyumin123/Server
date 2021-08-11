import client from "../../client"
import { tokenUpdate, tokenVaildation, userProfile } from "../auth/kakaoAuth.utils"
import jwt from "jsonwebtoken"
import { getUser, tokenIssuance } from "../users.utils"

export default{
    Mutation:{
        // uniqueValue에 해당하는 유저 확인:없으면 NotFound Return?토큰발급 -> ok Return
        authUserLogin:async(_,{email})=>{
            // 토큰 유효성검사는 server.js 
            // UniqueValue 확인
            const user = await client.user.findUnique({
                where:{email},
                select:{id:true}
            })
            if(!user){
                return{
                    ok:false,
                    error:process.env.NotFound_User
                }
            }
            //토큰 발급
            const token = await tokenIssuance(user.id)
            return{
                ok:true,
                token
            }


         
        }
    }

}