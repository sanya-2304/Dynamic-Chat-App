const mongoose=require('mongoose')
const {Schema, model}=require('mongoose')

const groupSchema=new Schema({
   creator_id:{
    type:Schema.Types.ObjectId,
    ref:'user'
   },
   name:{
    type:String,
    required:true
   },
   image:{
    type:String, required:true
   },
   limit:{
    type:Number, required:true
   }
}, {timestamps:true})

const groupModel=model('Group', groupSchema);

module.exports=groupModel