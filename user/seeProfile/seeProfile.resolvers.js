import client from "../../client";


export default{
    Query:{
        seeProfile:async(_,{userName})=>{
            const result =await client.user.findUnique({
              where:{userName}
            })
            return result
        }
    }
}

