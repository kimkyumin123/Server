require('dotenv').config()
const express=require('express');
const { auth } = require('./Auth');
const { tokenVaildation } = require('./user/auth/kakaoAuth.utils');

// Mailing
// import nodemailer from "nodemailer"
// import ejs from "ejs"

// import fetch from 'node-fetch';
// import { tokenVaildation } from './user/auth/auth.utils';


// var appDir =path.dirname(require.main.filename)
// Mailing
const PORT =process.env.PORT
const app=express()

// app.use(express.static('resources'));

// app.use(logger('tiny'))

app.get('/kakao_auth',async (req,res)=>{
  
  const data= await tokenVaildation(req.query.token)
  res.json(data)
})

app.get('/facebook_auth',async (req,res)=>{
  
  const data= await tokenVaildation(req.query.token)
  res.json(data)
})
app.get('/facebook_auth',async(req,res)=>[

])
app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.get('/test',(req,res)=>{
  var query = `mutation UserLogin($userName: String!, $passwd: String!) {
    userLogin(userName: $userName, password: $passwd){
      ok,
      error,
      token{
        refreshToken
        accessToken
      }
    }
  }`;
  var userName="lso5507"
  var passwd="1111"
  fetch('http://localhost:4000/graphql', {
    
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables:{
        userName,
        passwd
      }
    })
  })
    .then(r => r.json())
    .then(data => console.log('data returned:', data));
})

app.get('/auth',(req,res)=>{
  
  auth().then((e)=>{
  
    // res.writeHead(200, {'Content-Type' : 'text/plain'});
    // res.end(e)
    res.redirect(e)
  })
})
app.get('/hello',(req,res)=>{
  res.send("hello")
})
app.get('/login/callback',(req,res)=>{
  AccessTokenRequest(req)
  
})
app.post('/login/callback',(req,res)=>{
  console(req)
  
})


app.post('/tokenUpdate',async(req,res)=>{
  
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

// app.listen({port:PORT},()=>{
//   console.log(`server is Running localhost:${PORT}`)
// })

module.exports=app