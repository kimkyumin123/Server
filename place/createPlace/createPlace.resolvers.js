import client from "../../client";
import { protectedResolver } from "../../user/users.utils";


const createPlaceFN= async(_,{place},{loggedInUser,logger})=>{
    // 로그인 상태-> [Place]형태로 전달받은 데이터 낱개로 DB 트랜잭션
    if(loggedInUser===process.env.AccessTokenExpiredError){
        logger.error(`${__dirname}|AccessTokenExpiredError`)
        return{
            ok:false,
            error:process.env.AccessTokenExpiredError
        }

    }
    else if(loggedInUser===process.env.Invaild_Token){
        logger.error(`${__dirname}|Invaild_Token`)
        return{
            ok:false,
            error:process.env.Invaild_Token
        }
    }
    else if(!loggedInUser){
        logger.error(`${__dirname}|UserNotFound`)
        return{
            ok:false,
            error:process.env.CheckLogin
        }
    }
    place.forEach(async(element) => {
        try{
        const placeOverlap = await client.place.findUnique({
            where:{
                uniqueId:element.placeId
            }
        })
                //있을시 중복처리
        if(placeOverlap){
            logger.info(`${__dirname}|Already Place %o`,placeOverlap)
        }
        }catch(e){
            logger.error(`${__dirname}|%o`,e)
            return{
                ok:false,
                error:process.env.Transaction_ERROR
            }
        }
        try{
            const result = await client.place.create({
                data:{
                    title:element.title,
                    address:element.address,
                    zipCode:element.zipCode,
                    x:element.x,
                    y:element.y,
                    category:element.category,
                    uniqueId:element.placeId


                }

            })
            if(!result){
                return{
                    ok:false,
                    error:process.env.CreateFail_Place
                }
            }
            logger.info(`${__dirname}| %o`,result)
     }catch(e){
        logger.error(`${__dirname}|%o`,e)
        return{
            ok:false,
            error:process.env.Transaction_ERROR
        }
     }
        

    });
    return {
        ok:true
    }


    
    
}
export default {
    Mutation:{
        createPlace:protectedResolver(createPlaceFN)
    }
}