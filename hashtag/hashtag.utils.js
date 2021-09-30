export const processHashtags = (caption)=>{

    const hashtags = caption.match(/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g)|| []
    console.log("hashtags:::",hashtags)
    return hashtags.map((hashtag)=>({
          where:{hashtag},
          create:{hashtag}
      }))
}
