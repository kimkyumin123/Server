import client from "../../client"
import bcrypt from "bcrypt"
export default{
    Mutation:{
        createUser:async(_,{userName,nickName,email,avatar,password,PhoneNumber},__)=>{
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
            console.log(uglyPassword)
            const newUser = await client.user.create({
                data:{
                    userName,
                    email,
                    PhoneNumber,
                    avatar,
                    password:uglyPassword,
                    nickName 
                }
            })
            console.log(newUser)
            return {
                ok:true,

            }
        }
    }
}