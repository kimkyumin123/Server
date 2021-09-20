import client from "../../client"
import logger from "../../logger"
import { uploadToS3 } from "../../shared/shard.utils"
import { protectedResolver } from "../../user/users.utils"
import { createPlace } from "../review.utils"
const createReviewResult = async(e,loggedInUser,resultRoom)=>{
  //AWS S3 업로드
        let  fileUrl=null
        if(e.upload){
             fileUrl= await  uploadToS3(e.upload,loggedInUser.id,`review/${loggedInUser.id}`)
        }
       
        //Content내용중 해시태그 분류 
        try{
            // const placeId = await client.place.findFirst({
            //     where:{
            //         title:e.placeId
            //     },
            //     select:{
            //         id:true
            //     }
            // })
            // logger.info(`${__dirname}| %o`,placeId)
            const resultPlace = await createPlace(e.place)
            
            if(resultPlace===process.env.Transaction_ERROR ||resultPlace===process.env.CreateFail_Place ){ //장소 트랜잭션실패
                return resultPlace
            }else {
        
                try{
                //장소 연결(후에 유니크 값 찾아야함.)
                    const result = await client.review.create({
                        data:{
                            //수정
                        title:e.title,
                        ...(e.upload&&({upload:fileUrl})),
                        content:e.content,
                        user:{
                            connect:{
                                
                                id:loggedInUser.id
                            }
                        },
                        place:{
                            connect:{
                                    id:resultPlace
                            }
                            },
                        reviewRoom:{
                            connect:{
                                id:resultRoom.id
                            }
                        }
                        },
                    })
                    if(!result){
                        logger.info(`${__dirname}| NOTFOUND:::%o`,result)
                        return process.env.CreateFail_Review
                    }
                    logger.info(`${__dirname}| %o`,result)
                    //성공
                    return true
                }catch(e){
                    logger.error(`${__dirname} | %o`,e)
                    return process.env.Transaction_ERROR
                }
                    
            }


         }catch(e){
            
            logger.error(`${__dirname}| %o`,e)
            return process.env.CreateFail_Review
         }

}
const createReviewFN= async(_,{review},{loggedInUser,logger})=>{
    //로그인 체크 -> 전달받은 JSON 형태 리뷰 배열 생성. 
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
     let result=null
        //reviewRoom 빈프레임 먼저 생성
        const resultRoom = await client.reviewRoom.create({
        data:{

        }
        })
        logger.info(`${__dirname}| %o`,resultRoom)
     for(const i in review){
        result =await createReviewResult(review[i],loggedInUser,resultRoom)
        console.log("result::",result)
        if(result===process.env.CreateFail_Review ||result===process.env.Transaction_ERROR){
            // 에러시 생성했던 룸 삭제
            const deleteRoom=await client.reviewRoom.delete({
                where:{
                    id:resultRoom.id
                }
            })
            logger.info(`${__dirname}|DELETE %o`,deleteRoom)
            break;
        }
    };
    if(result===true){
        return{
            ok:true,
            
        }
    }else{
        return{
            ok:false,
            error:result
        }
    }
    




}

export default{

    Mutation:{
        createReview:protectedResolver(createReviewFN)
    }
}