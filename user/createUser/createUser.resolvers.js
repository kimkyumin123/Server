import client from "../../client"
import bcrypt from "bcrypt"
export default{
    Mutation:{
        createUser:async(_,{bio,userName,nickName,email,avatar,password},__)=>{
            const user = await client.user.findFirst({
                where:{
                    OR:[
                        {
                            userName
                        },
                        {
                            email
                        }
                    ]
                }
            })

            if(user){
                return{
                    ok:false,
                    error:"Already In User"
                }
            }
            const uglyPassword= await bcrypt.hash(password, 10)
            const newUser = await client.user.create({
                data:{
                    userName,
                    email,
                    avatar,
                    password:uglyPassword,
                    nickName,
                    bio
                }
            })
            
            return {
                ok:true,

            }
        }
    }
}