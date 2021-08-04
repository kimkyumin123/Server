import client from "../../client"
import bcrypt from "bcrypt"
export default{
    Mutation:{
        createUser:async(_,{bio,userName,nickName,email,avatar,password},{logger})=>{
    
            const user = await client.user.findFirst({
                where:{
                    OR:[
                        {
                            userName
                        },{
                            email
                        }

                    ]
                }
            })
            if(user){
                return{
                    ok:false,
                    error:process.env.Already_User
                }
            }
            const uglyPassword= await bcrypt.hash(password, 10)
            try{
                await client.user.create({
                    data:{
                        userName,
                        email,
                        ...(avatar&&{avatar}),
                        ...(password&&{password:uglyPassword}),
                        nickName,
                        bio
                    }
                })
            }catch(e){
                logger.error(__dirname,e)
                return {
                    ok:false,
                    error:process.env.UncaughtException
                }
            }
            
            return {
                ok:true,

            }
        }
    }
}