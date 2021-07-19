import axios from "axios";
import { response } from "express";
import {google} from "googleapis"
import fetch from "node-fetch";



// Test
export const auth =async()=>{
  
  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_RESTKEY}&redirect_uri=http://localhost:4000/login/callback&response_type=code`


 return url
}
export const AccessTokenRequest = async(req)=>{
  const {code} =req.query
  console.log(code)
  
try{
console.log(process.env.KAKAO_SecretKEY)
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

