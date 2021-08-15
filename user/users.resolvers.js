import client from "../client"

export default{
    Query:{
        userCheck:async(_,{nickName,email})=>{

            //nickName 체크 
            if(nickName){
                const nameCheck = await client.user.findUnique({
                    where:{nickName}
                })
                if(nameCheck){
                    return{
                        ok:false,
                        error:process.env.Already_Nickname
                    }
                }
                return{
                    ok:true
                }
            }
            if(email){
                const emailCheck = await client.user.findUnique({
                    where:{email}
                })
                if(emailCheck){
                    return{
                        ok:false,
                        error:process.env.Already_Email
                    }
                }
                return{
                    ok:true
                }
            }
            return{
                ok:false,
                error:"Null"
            }
        }
    },

}

