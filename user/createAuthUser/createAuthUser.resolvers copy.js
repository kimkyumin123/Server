import { token } from "morgan"
import client from "../../client"
import { userProfile } from "../auth/auth.utils"

export default{
    Mutation:{
        createAuthUser:async(_,{nickName,avatar,bio,uniqueValue,delimiter,gender},{accessToken,refreshToken})=>{
            //중복된 닉네임 확인
            const ExistUser=await client.user.findFirst({
                where:{nickName}
            })
            if(ExistUser){
                return{
                    ok:false,
                    error:"Already In User"
                }
            }
            const resultUser = await client.user.create({
                data:{
                    nickName,
                    uniqueValue:`${delimiter}_${uniqueValue}`,
                    ...(bio&&{bio:bio}),
                    gender,
                    ...(avatar&&{avatar:avatar})
                }
            })
            if(!resultUser){
                return{
                    ok:false,
                    error:"Create user Failed"
                }
            }
            return{
                ok:true,

            }

        }
    }

}