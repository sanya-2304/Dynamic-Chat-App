require('dotenv').config()

const express=require('express')
const http=require('http')
const PORT=process.env.PORT|| 1202;
const {Server}=require('socket.io')
const mongoose=require('mongoose')
const userRoutes=require('./routes/userRoute')

mongoose.connect('mongodb://localhost:27017/banter-dynamic-chat-app').then(()=>console.log(''))
const app=express();
app.use('/', userRoutes)
const server=http.createServer(app);
const io=new Server(server)

server.listen(PORT, ()=>console.log(`Server running on PORT ${PORT}`));