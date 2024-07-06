require('dotenv').config()

const express=require('express')
const http=require('http')
const userModel=require('./models/UserModel')
const PORT=process.env.PORT|| 1202;
const {Server}=require('socket.io')
const mongoose=require('mongoose')
const userRoutes=require('./routes/userRoute')
const path=require('path')
const chatModel=require('./models/ChatModel')
 
mongoose.connect('mongodb://localhost:27017/banter-dynamic-chat-app').then(()=>console.log(''))
const app=express();
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/', userRoutes)
const server=http.createServer(app);
const io=new Server(server)
io.on('connection', async (socket)=>{
    // console.log('socket connected with id ', socket.id)
    var user_id=socket.handshake.auth.token;
    await userModel.findByIdAndUpdate({_id:user_id}, {$set:{is_online:'1'}})
    // broadcast online status 
    socket.broadcast.emit('getOnlineUser', {user_id: user_id})
    socket.on('disconnect', async()=>{
        console.log('socket disconnected')
        await userModel.findByIdAndUpdate({_id:user_id}, {$set:{is_online:'0'}})
         // broadcast offline status 
    socket.broadcast.emit('getOfflineUser', {user_id: user_id})
    })
    //chatting implementation
    socket.on('newChat', function(data){
        socket.broadcast.emit('loadnewchat', data)
    })
    //load chats
    socket.on('existsChat', async function(data){
       var chats= await chatModel.find({
                $or:[
                    {sender_id:data.sender_id, receiver_id:data.receiver_id},
                    {sender_id:data.receiver_id, receiver_id:data.sender_id}
                ]
        })
        socket.emit('loadChats', {chats:chats})
    })
})

server.listen(PORT, ()=>console.log(`Server running on PORT ${PORT}`));