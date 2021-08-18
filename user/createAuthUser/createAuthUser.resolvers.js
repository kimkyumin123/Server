import { token } from "morgan"
import client from "../../client"
import { userProfile } from "../auth/kakaoAuth.utils"
import { naver_auth } from "../auth/naverAuth.utils"

export default{
    Mutation:{
        /*==================platformType===================
            kakao,
            naver,
            apple

        ==================platformType===================*/
        // 토큰에서 이메일 추출 ->중복이메일 확인?중복시 가입된이력안내:PASS -> 중복된닉네임확인?중복시 중복확인:PASS ->DB 트랜잭션->성공여부전달
        createAuthUser:async(_,{nickName,avatar,bio,token,platformType,gender},{logger})=>{
            
        
            // 토큰에서 이메일 추출
            let result = null
            if(platformType.toLowerCase()==="kakao"){
                 result = await userProfile(token)
                 logger.info(`${__filename}| UserEmail:${result}`)
            }
            else if(platformType.toLowerCase()==='naver'){
                result = await naver_auth(token)
                logger.info(`${__filename}| UserEmail:${result}`)
            }
    
            if(!result){ //Token 유효성 검사
                return{
                    ok:false,
                    error:process.env.Invaild_Token
                }
            }
            
            //중복이메일 확인
            const ExistEmail = await client.user.findUnique({
                where:{email:result},
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
                    email:result,
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