

import { tokenUpdate, tokenValidation, userProfile } from "../auth/auth.utils"


export default{
    Mutation:{
        authVaildation: async(_,__,{accessToken,refreshToken})=>{
           const result= await tokenValidation(accessToken) //유효성검사
           
           if(result.code){ //유효성검사 실패
            // -1	카카오 플랫폼 서비스의 일시적 내부 장애 상태
            // 토큰을 강제 만료(폐기) 또는 로그아웃 처리하지 않고 일시적인 장애 메시지로 처리 권장	400
            // -2	필수 인자가 포함되지 않은 경우나 호출 인자값의 데이터 타입이 적절하지 않거나 허용된 범위를 벗어난 경우
            // 요청 시 주어진 액세스 토큰 정보가 잘못된 형식인 경우로 올바른 형식으로 요청했는지 확인	400
            // -401	유효하지 않은 앱키나 액세스 토큰으로 요청한 경우
            // 토큰 값이 잘못되었거나 만료되어 유효하지 않은 경우로 토큰 갱신 필요	401
            
            if(result.code===-401){
                tokenUpdate(refreshToken,accessToken) //액세스토큰 만료시 재발급
                //Token 발급이 제대로 되었는지 확인 필요
                //Token JWT 형태로 저장 필요

            }else if(result.code===-2){
                return {
                    ok:false,
                    error:"Required element not found"
                }
            }else if(result.code===-1){
                return{
                    ok:false,
                    error:"temporary error"
                }
            }
           }
           else{         // 토큰 유효성 검사 통과
            console.log("tests")
            const profileProper=await  userProfile(accessToken)
            const {kakao_account:{age_range,gender,profile:{nickname,profile_image_url}}}=profileProper
            console.log(profileProper)
              return{
                  ok:true,
                  age_range,
                  gender,
                  nickname,
                  profile_image_url
                  
              }
           }
        
        
        




            
            

        }
    }

}