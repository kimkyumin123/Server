import client from "../../client"
import { uploadToS3 } from "../../shared/shard.utils"
import { protectedResolver } from "../../user/users.utils"

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
    //리뷰 담기위해 빈 프레임 생성
    const resultRoom = await client.reviewRoom.create({
        data:{

        }
    })
    logger.info(`${__dirname}| %o`,resultRoom)
    review.forEach(async(e) => {
        //AWS S3 업로드
    //    const fileUrl= await  uploadToS3(e.upload,loggedInUser.id,`review/${loggedInUser.id}`)
        //Content내용중 해시태그 분류 
        const placeId = await client.place.findFirst({
            where:{
                title:e.place
            },
            select:{
                id:true
            }
        })
        console.log(placeId.id)
        //장소 연결(후에 유니크 값 찾아야함.)
        const result = await client.review.create({
            data:{
                //수정
               title:e.title,
            //    upload:fileUrl,
               content:e.content,
               user:{
                   connect:{
                       
                       id:loggedInUser.id
                   }
               },
               place:{
                   connect:{
                        id:placeId.id
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
            return{
                ok:false,
                error:process.env.CreateFail_Review
            }
        }
        logger.info(`${__dirname}| %o`,result)

        
    });
    return {
        ok:true
    }



}

export default{

    Mutation:{
        createReview:protectedResolver(createReviewFN)
    }
}