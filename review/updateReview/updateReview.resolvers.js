import client from "../../client";
import { processHashtags } from "../../hashtag/hashtag.utils";
import logger from "../../logger";
import { uploadToS3 } from "../../shared/shard.utils";
import { protectedResolver } from "../../user/users.utils";
import { createPlace } from "../review.utils";

const updateReviewResult = async(e,loggedInUser)=>{
    try{
        // 해당 리뷰 유효확인
        const existReview= await client.review.findFirst({
            where:{
                id:e.id
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
            logger.info(`${__dirname}|NOTFOUND_Review::${e.id}`)
            return process.env.NotFound_Review
        }
        //AWS S3 Delete

        //AWS S3 Upload
        let  fileUrl=null
        if(e.upload){
             fileUrl= await  uploadToS3(e.upload,loggedInUser.id,`review/${loggedInUser.id}`)
        }
        // placeCreate
        let resultPlace=null
        if(e.place){
             resultPlace = await createPlace(e.place)
            if(resultPlace===process.env.Transaction_ERROR ||resultPlace===process.env.CreateFail_Place ){ //장소 트랜잭션실패
                return resultPlace
            }
        }
        //해시태그 수정
        let hashtagObj = []
        if(e.content){
            hashtagObj=processHashtags(e.content)
        }
        console.log("existReview.hashtags",existReview.hashtags)
        // 리뷰 업데이트
        const reviewResult = await client.review.update({
            where:{
                id:e.id
            },
            data:{
                ...(e.title&&{title:e.title}),
                ...(e.upload&&{upload:fileUrl}),
                ...(e.content&&{content:e.content}),
                ...(e.place&&{place:{
                    connect:{
                        id:resultPlace
                    }
                }}),
                hashtags:{
                    disconnect:existReview.hashtags,
                    connectOrCreate:processHashtags(e.content)
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
const updateReviewFN= async(_,{review},{logger,loggedInUser})=>{
    //유저 로그인 확인
    if(loggedInUser===process.env.AccessTokenExpiredError){
        return{
            ok:false,
            error:process.env.AccessTokenExpiredError
        }

    }
    else if(loggedInUser===process.env.Invaild_Token){
        return{
            ok:false,
            error:process.env.Invaild_Token
        }
    }
    else if(!loggedInUser){
        return{
            ok:false,
            error:process.env.CheckLogin
        }
    }
    // 결과 값 확인용도
    let result=null
    for(const i in review){
        result =await updateReviewResult(review[i],loggedInUser)
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