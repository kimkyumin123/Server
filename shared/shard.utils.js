import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId:process.env.AWS_KEY,
    secretAccessKey:process.env.AWS_SECRET

})


// AWS S3 업로드 
export const uploadToS3 = async(avatar,userid,fodlerName)=>{
    const {filename,createReadStream}=await avatar
    const newFileName = `${fodlerName}/${userid}+${Date.now()}+${filename}`;
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
