require('dotenv').config()
import express, { response } from 'express'
import  {ApolloServer} from "apollo-server-express";
import {resolvers,typeDefs} from "./schema";
import logger from 'morgan'
import {  AccessTokenRequest, authorization ,auth} from './Auth';


const server = new ApolloServer({
  resolvers,typeDefs,
  context:async({req}) =>{
    return{
      req,
    accessToken:req.headers.accesstoken,
    refreshToken:req.headers.refreshtoken,
    
    }
}


})
const PORT =process.env.PORT
const app=express()

// app.use(express.static('resources'));
server.applyMiddleware({app})
app.use(logger('tiny'))
app.get('/auth',(req,res)=>{
  
  auth().then((e)=>{
  
    // res.writeHead(200, {'Content-Type' : 'text/plain'});
    // res.end(e)
    res.redirect(e)
  })
})
app.get('/auth')
app.get('/login/callback',(req,res)=>{
  AccessTokenRequest(req)
  
})
app.post('/login/callback',(req,res)=>{
  console(req)
  
})
app.listen({port:PORT},()=>{
  console.log(`server is Running localhost:${PORT}`)
})