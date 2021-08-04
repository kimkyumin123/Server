import jwt, { JsonWebTokenError, TokenExpiredError }  from 'jsonwebtoken'
import client from '../client';
import logger from '../logger';

// 토큰 유효성검사 
export const getUser = async(token) =>{
    try{ 
        //토큰이 없을때
        if(!token){
            //수정필요
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
            logger.error(process.env.AccessTokenExpiredError)
            return process.env.AccessTokenExpiredError
        }
        //토큰이 유효하지 않을때
        if(e instanceof JsonWebTokenError){
            //재로그인 요청
            logger.error(e)
            return process.env.Invaild_Token
        }
        throw e
    }
}
//로그인 필요한 작업일때.
export const protectedResolver = (ourResolver)=>(root,args,context,info)=>{
    //query와 Mutation 구분
    const query =  info.operation.operation === "query"
    if(query){
        if(!context.loggedInUser){
            return null
        }
    }else{
        logger.error(process.env.CheckLogin)
        if(!context.loggedInUser){
            return{
                ok:false,
                error:process.env.CheckLogin
            }
        }
    }
    
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
        
    // const result=await client.user.update({
    //     where:{
    //         id:userId
    //     },
    //     select:{
    //         token:true
    //     },
    //     data:{
    //         token
    //     }
    // })
    const data = new Object();
    data.accessToken=accessToken;
    data.refreshToken=refreshToken
    return data;

}

// 토큰삭제
export const tokenDelete = async()=>{
    // 삭제할 토큰을 모아둘 Table 생성해야함.
}
// RefreshToken을 통한 토큰 업데이트
export const tokenUpdate = async(token)=>{

    //토큰이 없을때
    if(!token){
    logger.error(process.env.NOTFOUND_Token)
    return process.env.NOTFOUND_Token
    }
    
    //리프레쉬토큰 만료 확인
    try{
        
        //토큰 유효성검사
        const {id} = jwt.verify(token,process.env.SECRET_KEY)
        //토큰 발급
        const data= tokenIssuance(token)
        return data
    }catch(e){
        
        //리프레쉬토큰 만료
        if(e instanceof TokenExpiredError){
            //재로그인 요청
            logger.error(process.env.RefreshTokenExpiredError)
            return process.env.RefreshTokenExpiredError;
        }
        // 토큰이 유효하지 않을때
        if(e instanceof JsonWebTokenError){
            //재로그인 요청
            logger.error(process.env.Invaild_Token)
            return process.env.Invaild_Token
        }
        throw e
    }
    //리프레쉬 토큰 만료시 로그인요청

    //리프레쉬 토큰 만료가 아닐시에 액세스토큰 발급

}


