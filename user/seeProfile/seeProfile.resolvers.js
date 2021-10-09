import client from "../../client";


export default{
    Query:{
        seeProfile:async(_,{userName})=>{
            const result =await client.user.findUnique({
              where:{userName},
              include:{
                  reviews:true,
                  suggestions:true
              }
            })
            console.log(result)
            return result
        }
    }
}

