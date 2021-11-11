import AWS from 'aws-sdk'
import logger from '../logger';

AWS.config.update({
    accessKeyId:process.env.AWS_KEY,
    secretAccessKey:process.env.AWS_SECRET

})


// AWS S3 업로드 
export const uploadToS3 = async(avatar,userName,fodlerName)=>{
    const {filename,createReadStream}=await avatar
    console.log("avatar::",avatar.upload)
    const newFileName = `${fodlerName}/${userName}/+${Date.now()}+${filename}`;
    const readStream = createReadStream();
    console.log("UPLOAD")
    const ok = await new AWS.S3().upload({
        Bucket:"instaclone-upload-lee",
        Key:newFileName,
        ACL:"public-read",
        Body:readStream
    })
    .promise();
    console.log(ok)
    return ok.Location;
    
}
export const deleteToS3 = async(fileUrl)=>{
    await new AWS.S3().deleteObject({
        Bucket: 'instaclone-upload-lee', // 사용자 버켓 이름
        Key: 'image/helloworld.jpeg' // 버켓 내 경로
      }, (err, data) => {
        if (err) { throw err; }
        console.log('s3 deleteObject ', data)
    })
}



export const exceptionsHandler= async (e)=>{
    console.log(e)

    // ================================ LoggedInUser Exception ================================
    if(e===process.env.AccessTokenExpiredError){
            logger.error(`${__dirname}|AccessTokenExpiredError`)
            return process.env.AccessTokenExpiredError
        }
    else if(e===process.env.Invaild_Token){
        logger.error(`${__dirname}|Invaild_Token`)
        return process.env.Invaild_Token
    }
    else if(!e){
        logger.error(`${__dirname}|UserNotFound`)
        return process.env.CheckLogin
    }
    // 폐기토큰 사용 핸들링 
    else if(e===process.env.DiscardToken){
        logger.error(`${__dirname}|This Token discardToken `)
        
        return process.env.DiscardToken 
    }
    // ================================ LoggedInUser Exception ================================
    return 1
    switch(e){
        case e instanceof TypeError:
            console.log("TYPE")
            return "TYPEERORR"
    }
}