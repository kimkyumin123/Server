require('dotenv').config()
import express, { response } from 'express'
import  {ApolloServer} from "apollo-server-express";
import {resolvers,typeDefs} from "./schema";
import morgan from 'morgan'
import logger from './logger'
import {  AccessTokenRequest, authorization ,auth, naver_auth} from './Auth';
import { getUser, tokenUpdate } from './user/users.utils';
// Mailing
import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"
import fetch from 'node-fetch';
import { userProfile } from './user/auth/kakaoAuth.utils';
import { graphqlUploadExpress } from "graphql-upload";
import cron from "node-cron"
import { refreshTokenDelete } from './schedule/TokenSchedule';
var appDir =path.dirname(require.main.filename)

//Cron Scheduled 월 1일마다 삭제
cron.schedule('* * * 1 * * ',async()=>{
  await refreshTokenDelete();
})


const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
     logger.info('Request started! Query:\n' +
      requestContext.request.query);
    // console.log(`Request started! Query`)

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        console.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!');
      },

    }
  },
};

// Mailing
const server = new ApolloServer({
  uploads:false,
  resolvers,typeDefs,
  plugins:[
    myPlugin
  ],
  context:async({req}) =>{
    
    return{
      loggedInUser:await getUser(req.headers.accesstoken),
      accessToken:req.headers.accesstoken,
      logger:logger

      
    
    }
}


})
const PORT =process.env.PORT
const app=express()

//  ReadStream.prototype.open() is deprecated ISSUE!
app.use(graphqlUploadExpress())
// app.use(express.static('resources'));
server.applyMiddleware({app})
app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
// app.use(logger('tiny'))
app.get('/auth',(req,res)=>{
  
  auth().then((e)=>{
  
    // res.writeHead(200, {'Content-Type' : 'text/plain'});
    // res.end(e)
    res.redirect(e)
  })
})
app.get('/kakao_auth',async (req,res)=>{
  console.log(req.query)
  const data= await userProfile(req.query.token)
  console.log(data);
  
})
app.get('/naver_callback',async(req,res)=>{
  console.log(req.query)
  await naver_auth(req.query.code,req.query.state)
})
app.get('/naver_auth',async(req,res)=>{
  const CALLBACKURL="http://localhost:4000/naver_callback"
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_ID}&state=STATE_STRING&redirect_uri=${CALLBACKURL}`
  
 
  res.redirect(url)
})
app.get('/facebook/callback',(req,res)=>{
  res.send("test")
})
app.get('/login/callback',(req,res)=>{
  AccessTokenRequest(req)
  
})

app.use(
  morgan('combined', 
    {
      
      skip: function (req, res) { return res.statusCode < 400 }, // http return 이 에러일때만 출력
      stream: logger.stream, // logger에서 morgan의 stream 을 받도록 추가
      
    }
  )
);

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  process.exit
});


app.use(express.urlencoded({extended:true})); 
app.use(express.json());



//EMAIL 인증 로직
app.post('/mail', async(req, res) => {
  
  let authNum = Math.random().toString().substr(2,6);
  let emailTemplete;
  try{
    console.log("req::",req.body)
  ejs.renderFile(appDir+'/template/authMail.ejs', {authCode : authNum}, function (err, data) {
    if(err){console.log(err)}
    emailTemplete = data;
  });

  let transporter = nodemailer.createTransport({
      service: 'naver',
      host: 'smtp.naver.com',
      port: 587,

      tls:{
        rejectUnauthorized: false
      },
      auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
      },
  });
  let message = {
    from: process.env.NODEMAILER_USER,
      to: req.body.email,
      subject: '회원가입을 위한 인증번호를 입력해주세요.',
      html: emailTemplete,
  }
  transporter.sendMail(message, function (error, info) {
      if (error) {
          console.log(error);
      }
      console.log("Finish sending email : " + info.response);
      //클라이언트에 인증번호 값 제공
      res.send(authNum);
      transporter.close()
  });
  }catch(e){
    console.log(e)
  }
});
app.listen({port:PORT},()=>{
  console.log(`server is Running localhost:${PORT}`)
})
