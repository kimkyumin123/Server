
const fetch =require ("node-fetch");


export const naver_auth =  async(code,state)=>{
  let data=null
const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_ID}&client_secret=${process.env.NAVER_KEY}&code=${code}&state=${state}`
await fetch(url, {
  method: 'POST',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',},
}).then(res=>res.json())
.then(json=>data=json)
.catch(err=>console.error(err))

  const tokenVaildation = `https://openapi.naver.com/v1/nid/me`
  const result = await fetch(tokenVaildation, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${data.access_token}`
    },
}).then(res=>res.json())
.then(json=>console.log(json))
.catch(err=>console.error(err))
  console.log(result.response.email)
}
// KAKAOTest
export const auth =async()=>{
  
  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_RESTKEY}&redirect_uri=http://localhost:4000/login/callback&response_type=code`


 return url
}

export const AccessTokenRequest = async(req)=>{
  const {code} =req.query
  console.log(code)
  
try{

fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',},
    body: `grant_type=authorization_code&client_id=${process.env.KAKAO_RESTKEY}&redirect_uri=http://localhost:4000/login/callback&code=${code}&client_secret=${process.env.KAKAO_SecretKEY}`
}).then(res=>res.json())
  .then(json=>console.log(json))
  .catch(err=>console.error(err))
}
catch(e){
  console.error(e)
}

}

