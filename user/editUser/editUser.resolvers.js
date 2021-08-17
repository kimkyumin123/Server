import client from "../../client"
import { uploadToS3 } from "../../shared/shard.utils"
import { protectedResolver } from "../users.utils"
const editUser = async(_,{nickName,bio,avatar,gender,ageRange,password},{loggedInUser,logger})=>{
//로그인된 유저 확인 -> 토큰 유효성검사 ->닉네임 중복검사 ->프로필사진 변경시 서버 업로드-> DB 트랜잭션 -> ok Return
    if(loggedInUser===process.env.AccessTokenExpiredError){
        return{
            ok:false,
            error:process.env.AccessTokenExpiredError

        }
    }

    let avatarUrl = null
    let uglyPassword = null
    //패스워드 암호화 및 Null 체크 
    if(password){
        uglyPassword = await bcrypt.hash(password,10);
    }
    //닉네임 중복검사
    const user = await client.user.findUnique({
        where:{nickName},
        select:{id:true}
    })
    if(user){
        return{
            ok:false,
            error:process.env.Already_Nickname
        }
    }
    // AWS S3 업로드 
    if(avatar){
        avatarUrl= await  uploadToS3(avatar,loggedInUser.id,"profile")
    }

    // DB 트랜잭션
    const result  = await client.user.update({
        where:{id:loggedInUser.id},
        data:{
            ...(bio&&{bio:bio}),
            ...(nickName&&{nickName}),
            ...(gender&&{gender}),
            ...(ageRange&&{ageRange}),
            ...(avatar&&{avatar:avatarUrl}),
            ...(uglyPassword&&{password:uglyPassword}),

        }
    })
    if(!result){
        return{
            ok:false,
            error:process.env.Transaction_ERROR
        }
    }
    return{
        ok:true,

    }
}
export default {
   
    Mutation:{
        editUser:protectedResolver(editUser)
    }
}