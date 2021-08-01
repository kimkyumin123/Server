import jwt, { JsonWebTokenError, TokenExpiredError }  from 'jsonwebtoken'
import client from '../client';

// 토큰 유효성검사 
export const getUser = async(token) =>{
    try{ 
        
        if(!token){
            return null
        }
        const {id} = jwt.verify(token,process.env.SECRET_KEY)
        const user =await client.user.findUnique({where:{id}});
        
        if(user){
            return user;
        }
        else{
            return null;
        }
    }
    catch(e){
        //토큰 만료
        if(e instanceof TokenExpiredError){
            const {id}=jwt.decode(token)
            
            const tokenResult = tokenUpdate(id)
            if(!tokenResult){
                return process.env.TokenExpiredError
            }
            return tokenResult
        }
        throw e
    }
}

export const protectedResolver = (ourResolver)=>(root,args,context,info)=>{

    const query =  info.operation.operation === "query"
    if(query){
        if(!context.loggedInUser){
            return null
        }
    }else{
        if(!context.loggedInUser){
            return{
                ok:false,
                error:"Please check to login"
            }
        }
    }
    console.log("protectedResolver In Success")
    return ourResolver(root,args,context,info);

}

// 토큰발급 
export const tokenIssuance = async(userId)=>{
    
    const accessToken = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
        expiresIn: '20s'
    });
    const refreshToken = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
        expiresIn: '30d'
    });
        
    const result=await client.user.update({
        where:{
            id:userId
        },
        select:{
            refreshToken:true
        },
        data:{
            refreshToken
        }
    })
    
    return accessToken;

}

// 토큰삭제
export const tokenDelete = async()=>{
    // 삭제할 토큰을 모아둘 Table 생성해야함.
}
// RefreshToken을 통한 토큰 업데이트
export const tokenUpdate = async(userId)=>{
    //리프레쉬 토큰 가져오기
    const user = await client.user.findUnique({
        where:{id:userId},
        select:{refreshToken:true}
    })
    
    //리프레쉬토큰 만료 확인
    try{
        const {id} = jwt.verify(user.refreshToken,process.env.SECRET_KEY)
        return await tokenIssuance(id)
    }catch(e){
        //리프레쉬토큰 만료
        if(e instanceof TokenExpiredError){
            //재로그인 요청
            return null;
        }
        // 토큰이 없을때
        if(e instanceof JsonWebTokenError){
            //재로그인 요청
            return null
        }
        throw e
    }
    //리프레쉬 토큰 만료시 로그인요청

    //리프레쉬 토큰 만료가 아닐시에 액세스토큰 발급

}


