import { token } from "morgan"
import client from "../../client"
import { userProfile } from "../auth/kakaoAuth.utils"

export default{
    Mutation:{
        /*==================ERROR CODE===================
        -100 = Email that already exists
        -101 = "Already In User"
        -102 = "Create user Failed"
        ==================ERROR CODE===================*/
        // 중복이메일 확인?중복시 가입된이력안내:PASS -> 중복된닉네임확인?중복시 중복확인:PASS ->DB 트랜잭션->성공여부전달
        createAuthUser:async(_,{nickName,avatar,bio,email,platformType,gender})=>{
            
        //중복이메일 확인
            const ExistEmail = await client.user.findUnique({
                where:{email},
                select:{email:true}
            })
            if(ExistEmail){
               return{
                   ok:false,
                   error:process.env.Already_Email 
               } 
            }

            //중복된 닉네임 확인
            const ExistUser=await client.user.findUnique({
                where:{nickName}
            })
            if(ExistUser){  
                return{
                    ok:false,
                    error:process.env.Already_User
                }
            }
            const resultUser = await client.user.create({
                data:{
                    nickName,
                    email,
                    platformType,
                    ...(bio&&{bio:bio}),
                    gender,
                    ...(avatar&&{avatar:avatar})
                }
            })
            if(!resultUser){
                return{
                    ok:false,
                    error:process.env.Failed_User
                }
            }
            return{
                ok:true,

            }

        }
    }

}