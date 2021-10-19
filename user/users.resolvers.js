import client from "../client"

export default{
    Query:{
        userCheck:async(_,{nickName,email,userName},{logger})=>{
            //userName 체크
            if(nickName){
                const userCheck = await client.user.findUnique({
                    where:{nickName},
                    select:{
                        userName:true
                    }
                })
                if(userCheck){
                    logger.error(`${__dirname}|${nickName} is AlreadyUserName`)
                    return{
                        ok:false,
                        error:process.env.Already_UserName
                    }
                }
            
            }
            //nickName 체크 
            if(nickName){
                const nameCheck = await client.user.findUnique({
                    where:{nickName},
                    select:{
                        nickName:true
                    }
                })
                if(nameCheck){
                    logger.error(`${__dirname}|${nickName} is AlreadyNickName`)
                    return{
                        ok:false,
                        error:process.env.Already_Nickname
                    }
                }
            
            }
            if(email){
                const emailCheck = await client.user.findUnique({
                    where:{email},
                    select:{
                        email:true
                    }
                })
                if(emailCheck){
                    logger.error(`${__dirname}|${email} is Alreadyemail`)
                    return{
                        ok:false,
                        error:process.env.Already_Email
                    }
                }
                //이메일 양식 유효성 검사
                let checkEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(email)
                if(!checkEmail){
                    logger.error(`${__dirname}| This Email is doesn't fit the form | Email:${email}`)
                    return{
                        ok:false,
                        error:process.env.CheckEmailForm
                    }
                }
               
            }
            //잡지못한 에러
            return{
                ok:true
            }
        }
    },

}

