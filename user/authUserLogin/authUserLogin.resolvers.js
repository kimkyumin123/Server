import client from "../../client"
import { kakao_auth, tokenUpdate, tokenVaildation, userProfile } from "../auth/kakaoAuth.utils"
import jwt from "jsonwebtoken"
import { getUser, tokenIssuance } from "../users.utils"
import { naver_auth } from "../auth/naverAuth.utils"

export default{
    Mutation:{
        // uniqueValue에 해당하는 유저 확인:없으면 NotFound Return?토큰발급 -> ok Return
        authUserLogin:async(_,{platform_type,accesstoken},{logger})=>{


            //토큰 유효성검사
            let result = null
            if(platform_type.toLowerCase()==="kakao"){
                 result = await userProfile(accesstoken)
                 logger.info(`${__filename}| UserEmail:${result}`)
            }
            else if(platform_type.toLowerCase()==='naver'){
                result = await naver_auth(accesstoken)
                logger.info(`${__filename}| UserEmail:${result}`)
            }
    
            if(!result){ //Token 유효성 검사
                return{
                    ok:false,
                    error:process.env.Invaild_Token
                }
            }

            const user = await client.user.findUnique({ //해당 이메일 조회
                where:{email:result},
                select:{
                    id:true,
                    platformType:true
                }
            })
            //User Not Found
            if(!user){
                logger.error(`${__dirname}| Not Found User:${result}`)
                return{
                    ok:false,
                    error:process.env.NotFound_User
                }
            }
            
            //Auth User인데 PlatformType이 없을때
            if(user.platformType===null){
                logger.error(`${__dirname}| is Not Auth User:${result}`)
                return{
                    ok:false,
                    error:process.env.IsNotAuthUser
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