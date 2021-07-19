import { token } from "morgan"
import client from "../../client"
import { tokenValidation, userProfile } from "../auth/auth.utils"

export default{
    Mutation:{
        createAuthUser:async(_,{nickName,avatar},{accessToken,refreshToken})=>{
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
            //사용자 DB등록
           const tokenData= await userProfile(accessToken)
           
           const data = tokenData.kakao_account.age_range
           const dataSlice= data.length>=5?data.slice(0,2):"babie" //20대~ 30대~ 
      
            const resultUser = await client.user.create({
                data:{
                    nickName,
                    uniqueValue:String(tokenData.id),
                    gender:tokenData.kakao_account.gender,
                    ageRange:dataSlice, //Front에서 20대~ 형식으로 전달해
                    ...(avatar&&{avatar:avatar})
                }
            })
            if(!resultUser){
                return{
                    ok:false,
                    error:"Create user Failed"
                }
            }

            const result = await client.authUser.create({
                data:{
                    accessToken,
                    refreshToken,
                    oauth_provider:"KAKAO", // {임시} 수정예정
                    user:{
                        connect:{
                            id:resultUser.id
                        }
                    }
                }
            })
            console.log(result)
            return{
                ok:true,

            }

        }
    }

}