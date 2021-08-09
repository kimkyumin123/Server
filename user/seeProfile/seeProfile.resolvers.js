import client from "../../client";


export default{
    Query:{
        seeProfile:async(_,{userName})=>client.user.findUnique({
            where:{userName}
        })
    }
}

