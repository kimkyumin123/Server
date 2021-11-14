import { GraphQLUpload } from "apollo-server-core"
import client from "../../client"
import { processHashtags } from "../../hashtag/hashtag.utils"
import logger from "../../logger"
import { exceptionsHandler, uploadToS3 } from "../../shared/shard.utils"
import { protectedResolver } from "../../user/users.utils"
import { createPlace} from "../review.utils"
 const createReviewResult = async(review,upload,loggedInUser,resultRoom)=>{
  //AWS S3 업로드
    
        let  fileUrl=null
        
        if(upload){
            
             fileUrl= await  uploadToS3(upload.upload,loggedInUser.userName,`review`)
             console.log("fileUrl::",fileUrl)
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
            // const resultPlace = await createPlace(review.place)
            const placeData  = review.place
            if(resultPlace===process.env.Transaction_ERROR ||resultPlace===process.env.CreateFail_Place ){ //장소 트랜잭션실패
                return resultPlace
            }else {
        
                try{
                //해시태그 로직
                let hashtagObj = []
                
                if(review.content){
                     hashtagObj =processHashtags(review.content)
                     console.log("hashtagObj::",hashtagObj)
                }
                
                //장소 연결(후에 유니크 값 찾아야함.)
                    const result = await client.review.create({
                        data:{
                            //수정
                        title:review.title,
                        ...(upload&&({upload:fileUrl})),
                        content:review.content,
                        user:{
                            connect:{
                                
                                id:loggedInUser.id
                            }
                        },
                        place:{
                            // connect:{
                            //         id:resultPlace
                            // }
                            connectOrCreate:{
                                create:{
                                    title: placeData.title,
                                    address: placeData.address,
                                    zipCode: placeData.zipCode,
                                    x: placeData.x,
                                    y: placeData.y,
                                    category: placeData.category,
                                    uniqueId: placeData.placeId
                                },
                                where:{
                                    uniqueId:placeData.placeId
                                }
                              
                            }
                            },
                        reviewRoom:{
                            connect:{
                                id:resultRoom.id
                            }
                        },
                        ...(hashtagObj.length> 0 &&{
                            hashtags:{
                                connectOrCreate: hashtagObj,
                            }
                        })
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
const createReviewFN= async(_,{review,upload},{loggedInUser,logger})=>{
    //로그인 체크 -> 전달받은 JSON 형태 리뷰 배열 생성. 
    //리뷰 갯수와 UploadFile 갯수가 동일해야함
    
    
    if(review.length!==upload.length){
        //동일하지 않으면 Fail
        return{
            ok:false,
            error:process.env.CheckReviewForm
        }

    }
    
    const exceptionResult = await  exceptionsHandler(loggedInUser)
    if(exceptionResult!==1){
        return{
            ok:false,
            error:exceptionResult
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
        
        result =await createReviewResult(review[i],upload[i],loggedInUser,resultRoom)
        
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
const createTestReviewFN= async(_,{review,upload},{loggedInUser,logger})=>{
    //로그인 체크 -> 전달받은 JSON 형태 리뷰 배열 생성. 
    //리뷰 갯수와 UploadFile 갯수가 동일해야함
    
    
    // if(review.length!==upload.length){
    //     //동일하지 않으면 Fail
    //     return{
    //         ok:false,
    //         error:process.env.CheckReviewForm
    //     }

    // }
    
    const exceptionResult = await  exceptionsHandler(loggedInUser)
    if(exceptionResult!==1){
        return{
            ok:false,
            error:exceptionResult
        }
    }
    try {
        await client.$transaction(async (prisma) => {
            //리뷰룸 생성
            const reviewRoomResult = await prisma.reviewRoom.create({
                data:{

                }
            })
            logger.info(`${__dirname}|ReviewRoom_CREATE:%o`,reviewRoomResult)
            //리뷰 생성
           
            const reviewResult = await prisma.review.createMany({
                data:review,
            
            })
            logger.info(`${__dirname}|Review_CREATE:%o`,reviewResult)

        })
      } catch (err) {
        console.log(err)
      }
      



}
const createTestResult = async(review,loggedInUser,resultRoom)=>{
    //AWS S3 업로드
      
  
         
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
              const resultPlace = await createPlace(review.place)
              const placeData  = review.place

            try{
                //해시태그 로직
                let hashtagObj = []
                
                if(review.content){
                    hashtagObj =processHashtags(review.content)
                    console.log("hashtagObj::",hashtagObj)
                }
            
    
            //장소 연결(후에 유니크 값 찾아야함.)
  
                const result = await client.review.create({
                    data:{
                        //수정
                    title:review.title,
                    content:review.content,
                    user:{
                        connect:{
                            
                            id:loggedInUser.id
                        }
                    },
                    place:{
                        // connect:{
                        //         id:resultPlace
                        // }
                        connectOrCreate:{
                            create:{
                                title: placeData.title,
                                address: placeData.address,
                                zipCode: placeData.zipCode,
                                x: placeData.x,
                                y: placeData.y,
                                category: placeData.category,
                                uniqueId: placeData.placeId
                            },
                            where:{
                                 
                            }
                        
                        }
                        },
                    reviewRoom:{
                        connectOrCreate:{
                            // id:resultRoom.id
                            create:{

                            },
                            where:{

                            }
                        }
                    },
                    ...(hashtagObj.length> 0 &&{
                        hashtags:{
                            connectOrCreate: hashtagObj,
                        }
                    })
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
                
        
  
  
           }catch(e){
              
              logger.error(`${__dirname}| %o`,e)
              return process.env.CreateFail_Review
           }
  
  }
const IsTest = false
export default{
    
    Mutation:{
        createReview:IsTest?protectedResolver(createTestReviewFN):protectedResolver(createReviewFN)
    }
}