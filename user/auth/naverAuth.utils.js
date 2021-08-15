import logger from "../../logger"

export const naver_auth =  async(token)=>{
    let data =null
    const tokenVaildation = `https://openapi.naver.com/v1/nid/me`
    const data=await fetch(tokenVaildation, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`
      },
  }).then(res=>res.json())
  .then(json=>logger.info(`${__dirname}|${json}`))
  .catch(err=>logger.error(`${__dirname}|${err}`))
   if(data.error){
       return false
   } else{
       return true
   }
  }