import client from "../../client";
import { processHashtags } from "../../hashtag/hashtag.utils";
import logger from "../../logger";
import { exceptionsHandler, uploadToS3 } from "../../shared/shard.utils";
import { protectedResolver } from "../../user/users.utils";
import { createPlace } from "../review.utils";

const updateReviewResult = async(review,upload,loggedInUser)=>{
    try{
        // 해당 리뷰 유효확인
        const existReview= await client.review.findFirst({
            where:{
                id:review.id
            },
            select:{
                userId:true,
                id:true,
                hashtags:{
                    select:{
                        hashtag:true
                    }
                }
            }
        })
        logger.info(`${__dirname}|existReview::%o`,existReview)
        
       if(existReview.userId!==loggedInUser.id){// 해당 리뷰 수정권한 확인
           logger.error(`${__dirname}|CheckPermission::Review_UserId:${existReview.userId}&&loggedInUser:${loggedInUser.id}`)
           return process.env.CheckPermission
       }
    
        if(!existReview){//리뷰가 없을경우
            logger.info(`${__dirname}|NOTFOUND_Review::${review.id}`)
            return process.env.NotFound_Review
        }
        //AWS S3 Delete

        //AWS S3 Upload
        let  fileUrl=null
        if(upload){
             fileUrl= await  uploadToS3(upload.upload,loggedInUser.userName,`review`)
        }
        // placeCreate
        let resultPlace=null
        if(review.place){
             resultPlace = await createPlace(review.place)
            if(resultPlace===process.env.Transaction_ERROR ||resultPlace===process.env.CreateFail_Place ){ //장소 트랜잭션실패
                return resultPlace
            }
        }
        //해시태그 수정
        let hashtagObj = []
        if(review.content){
            hashtagObj=processHashtags(review.content)
        }
        console.log("existReview.hashtags",existReview.hashtags)
        // 리뷰 업데이트
        const reviewResult = await client.review.update({
            where:{
                id:review.id
            },
            data:{
                ...(review.title&&{title:review.title}),
                ...(upload&&{upload:fileUrl}),
                ...(review.content&&{content:review.content}),
                ...(review.place&&{place:{
                    connect:{
                        id:resultPlace
                    }
                }}),
                hashtags:{
                    disconnect:existReview.hashtags,
                    connectOrCreate:processHashtags(review.content)
                }   
            }
        })
        logger.info(`${__dirname}|reviewResult::%o`,reviewResult)
        return true
    }catch(e){
        logger.error(`${__dirname}|%o`,e)
        return process.env.Transaction_ERROR
    }
}
const updateReviewFN= async(_,{review,upload},{logger,loggedInUser})=>{
 
  
    if(review.length!==upload.length){
        //동일하지 않으면 Fail
        return{
            ok:false,
            error:process.env.CheckReviewForm
        }

    }
    //유저 로그인 확인  
    const exceptionResult = await  exceptionsHandler(loggedInUser)
    if(exceptionResult!==1){
        return{
            ok:false,
            error:exceptionResult
        }
    }
    // 결과 값 확인용도
    let result=null
    for(const i in review){
        result =await updateReviewResult(review[i],upload[i],loggedInUser)
        if(result===process.env.NotFound_Review ||result===process.env.Transaction_ERROR||result===process.env.CheckPermission){
            //에러
            break;
        }
    };
    // 업데이트 성공
    if(result===true){
        return{
            ok:true
        }
    }
    //업데이트 실패
    else{
        return{
            ok:false,
            error:result
        }
    }

    
}
export default{
    Mutation:{
        updateReview:protectedResolver(updateReviewFN)
    }
}