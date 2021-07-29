import jwt  from 'jsonwebtoken'
import client from '../client';


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
    catch{
        return null;
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
    
    const accessToken = await jwt.sign({ id:userId}, process.env.SECRET_KEY, { 
        expiresIn: '24h' });
    const refreshToken = await jwt.sign({ id:userId}, process.env.SECRET_KEY, { 
        expiresIn: '30d' });
        console.log(refreshToken)
    const result=await client.user.create({
        where:{
            id
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
export const tokenUpdate = async()=>{
    
    //리프레쉬토큰 만료 확인

    //리프레쉬 토큰 만료시 로그인요청

    //리프레쉬 토큰 만료가 아닐시에 액세스토큰 발급

}


