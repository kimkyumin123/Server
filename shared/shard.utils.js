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
    console.log(e instanceof TypeError)
    switch(e){
        case e instanceof TypeError:
            console.log("TYPE")
            return "TYPEERORR"
    }
}