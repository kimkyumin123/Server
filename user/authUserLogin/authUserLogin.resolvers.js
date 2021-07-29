import client from "../../client"
import { tokenUpdate, tokenVaildation, userProfile } from "../auth/auth.utils"
import jwt from "jsonwebtoken"

export default{
    Mutation:{
        // 토큰유효성검사 -> 유효성실패?리프레쉬로재발급:유저프로필호출 -> userId 확인 후 로그인 
        authUserLogin:async(_,__,{accessToken})=>{
            const authInfo = await client.authUser.findFirst({
                where:{accessToken},
                select:{
                    accessToken:true,
                    refreshToken:true
                }
            })
            if(!authInfo){
                return{
                    ok:false,
                    error:"Token Not Found"
                }
            }
            let userAccessToken = authInfo.accessToken
            const userRefreshToken = authInfo.refreshToken
            //유효성검사
            const tokenResult=await tokenVaildation(userAccessToken)
            tokenUpdate(userRefreshToken)
            if(tokenResult.code && tokenResult.code===-401){// 유효하지 않거나 액세스토큰 만료
                try{
                tokenUpdate(userRefreshToken)
                }catch(e){
                    return{
                        ok:false,
                        error:e.value
                    }
                }
                const againVaildation = await tokenVaildation(userAccessToken)
                if(againVaildation.code&& againVaildation.code===-401){ //유효하지 않음
                    return{
                        ok:false,
                        error:againVaildation.msg
                    }
                }
            }else if(tokenResult.code && tokenResult.code ===-1){ //카카오 일시적 내부오류 
                return{
                    ok:false,
                    error:tokenResult.msg
                }
            }else if(tokenResult.code && tokenResult.code ===-2){ //인자 미포함,타입미적절
                return{
                    ok:false,
                    error:tokenResult.msg
                }
            }
            

            //UniqueValue Request
            const{uniqueValue}=String(await userProfile(userAccessToken))
            
            const result = await client.user.findFirst({
                where:{
                    uniqueValue
                },
                select:{
                    id:true
                }
            })
            
            const token = await jwt.sign({id:result.id},process.env.SECRET_KEY)
            return {
                ok:true,
                token,
            }

        }
    }

}