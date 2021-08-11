import client from "../../client";

export default{
    Query:{
        nicknameCheck:async(_,{payload},{logger})=>{
            const nameCheck = await client.user.findUnique({
                where:{nickName:payload}
            })
            if(!nameCheck){
                return{
                    ok:false,
                    error:process.env.Already_Nickname
                }
            }
            return{
                ok:true
            }
        }
        
    }

}