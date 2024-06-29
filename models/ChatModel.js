const mongoose=require('mongoose')
const {Schema, model}=require('mongoose')

const chatSchema=new Schema({
   sender_id:{
    type:Schema.Types.ObjectId,
    ref:'user'
   },
   receiver_id:{
    type:Schema.Types.ObjectId,
    ref:'user'
   },
   message:{
    type:String, required:true
   }
}, {timestamps:true})

const chatModel=model('chat', chatSchema);

module.exports=chatModel