import client from "../../client"
import bcrypt from "bcrypt"
import { userCheck } from "../users.utils"
import { uploadToS3 } from "../../shared/shard.utils"
export default{


    Mutation:{
        createUser:async(_,{bio,userName,nickName,email,avatar,password},{logger})=>{
             //패스워드 양식 유효성검사  (대소문자, 숫자, 특수문자 세가지 조합 이상 8자 이상의 비밀번호 구성)
             let checkPassword =/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(password)
             if(!checkPassword){
                 logger.error(`${__dirname}| This Password is doesn't fit the form | Password:${password}`)
                 return {
                     ok:false,
                     error:process.env.CheckPasswordForm
                 }
             }


             // User 유효성검사
            const result  =await userCheck(userName,nickName,email)
            if(result){
                return{
                    ok:false,
                    error:result
                }
            }

            // AWS S3
            let  fileUrl=null
            if(avatar){
                 fileUrl= await  uploadToS3(avatar,userName,`user`)
            }

           

            
            const uglyPassword= await bcrypt.hash(password, 10)
            try{    
                const result=await client.user.create({
                    data:{
                        userName,
                        email,
                        ...(avatar&&{avatar:fileUrl}),
                        ...(password&&{password:uglyPassword}),
                        nickName,
                        bio
                    }
                })
                logger.info(`${__dirname}| %o`,result)
            }catch(e){
                logger.error(__dirname,e)
                return {
                    ok:false,
                    error:process.env.Transaction_ERROR
                }
            }
            
            return {
                ok:true,

            }
        }
    }
}