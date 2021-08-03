require('dotenv').config()
import express, { response } from 'express'
import  {ApolloServer} from "apollo-server-express";
import {resolvers,typeDefs} from "./schema";
import morgan from 'morgan'
import logger from './logger'
import {  AccessTokenRequest, authorization ,auth} from './Auth';
import { getUser, tokenUpdate } from './user/users.utils';
// Mailing
import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"
import fs from 'fs'
import { ExceptionHandler } from 'winston';

var appDir =path.dirname(require.main.filename)
// Mailing
const server = new ApolloServer({
  resolvers,typeDefs,
  context:async({req}) =>{
    
    return{
      loggedInUser:await getUser(req.headers.accesstoken),
      accessToken:req.headers.accesstoken,

      
    
    }
}


})
const PORT =process.env.PORT
const app=express()

// app.use(express.static('resources'));
server.applyMiddleware({app})
// app.use(logger('tiny'))
logger.info("TESTLOG")
logger.error("Error")
app.use(
  morgan('combined', 
    {
      
      skip: function (req, res) { return res.statusCode < 400 }, // http return 이 에러일때만 출력
      stream: logger.stream, // logger에서 morgan의 stream 을 받도록 추가
      
    }
  )
);

app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.get('error',(req,res)=>{
  
})

app.get('/auth',(req,res)=>{
  
  auth().then((e)=>{
  
    // res.writeHead(200, {'Content-Type' : 'text/plain'});
    // res.end(e)
    res.redirect(e)
  })
})
app.get('/auths',(req,res)=>{
  const data=1
  console.log(data)
})
app.get('/login/callback',(req,res)=>{
  AccessTokenRequest(req)
  
})
app.post('/login/callback',(req,res)=>{
  console(req)
  
})
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
app.post('/tokenUpdate',async(req,res)=>{
  throw new Error('test')
  const refreshToken = req.body.refreshToken;
  try{
    if(!refreshToken){
      res.send(process.env.NOTFOUND_Token)
    }
    const data=await tokenUpdate(refreshToken)
    
    res.send(data)
  }catch(e){
    console.log(e)
    res.send(e)
  }
});