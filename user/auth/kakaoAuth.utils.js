import fetch from "node-fetch"
import client from "../../client"

//액세스토큰 기본 6시간 발급 
export const userProfile = async(accessToken)=>{  //프로필 조회(사전에 동의 된 scope내)
    const profile= await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(res=>res.json())
    .catch(err=>console.error(err))
    return profile
}
export const tokenVaildation=async(accessToken)=>{ //토큰 유효성 검사
    
    const data=await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res=>res.json())
    console.log(data)
    return data
}
export const tokenDelete=async(accessToken)=>{
    

fetch('https://kapi.kakao.com/v1/user/unlink', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
}).then(res=>res.json())
.catch(err=> err.code)
//DB Delete Code

}
export const tokenUpdate=async(refreshToken)=>{  //AccessToken 만료시 재발급

  const data= await  fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',},
    body: `grant_type=refresh_token&client_id=${process.env.KAKAO_RESTKEY}&refresh_token=${refreshToken}&client_secret=${process.env.KAKAO_SecretKEY}`
    }).then(res=>res.json())
    console.log(data)
    //AccessToken 트랜잭션
    const result= await client.authUser.update({
        where:{
            refreshToken
        },
        data:{
            accessToken:data.accessToken
        }
    })
    if(!result){
        throw new Error("Token Update Failed")
    }

    return data
}
