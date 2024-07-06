const userModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const chatModel=require('../models/ChatModel')

const registerLoad = async (req, res) => {
    try {
        res.render('register');
    } catch (err) {
        console.log(err.message);
    }
};

const register = async (req, res) => {
    try {
        const passhash = await bcrypt.hash(req.body.password, 10);

        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            image: 'public/images/' + req.file.filename,
            password: passhash,
        });

        await user.save();
        res.render('register', { message: "Registered successfully!" });
    } catch (err) {
        console.log(err.message);
    }
};

const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (err) {
        console.log(err.message);
    }
};

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log('Email:', email); // Debugging: Log the email being queried
        // console.log('Password:', password); // Debugging: Log the password being input

        const userData = await userModel.findOne({ email: email });
        // console.log('User Data:', userData); // Debugging: Log the user data found
        if(!userData){
            return res.status(400).send('User not found');
        }
        if (userData) {
            const passMatch = await bcrypt.compare(password, userData.password);
            if (passMatch) {
                console.log('Password match successful');
                req.session.user = userData;
                res.redirect('/dashboard');
            } 
            else {
                console.log('Password does not match');
                res.render('login', { message: "Email or password is incorrect" });
            }
        } 
        // else {
        //     console.log('User not found');
        //     res.render('login', { message: "Email or password is incorrect" });
        // }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
    }
};

const loadDashboard = async (req, res) => {
    try {
        if (req.session.user) {
            var users=await userModel.find({_id:{$nin:[req.session.user._id]}})
            res.render('dashboard', { user: req.session.user, users:users });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err.message);
    }
};

const saveChat=async(req, res)=>{
    const { sender_id, receiver_id, message } = req.body;
    try{
        const chat=new chatModel({
            sender_id:req.body.sender_id,
            receiver_id: req.body.receiver_id, // Corrected key
            message:req.body.message,
        })
       var newchat= await chat.save();
        res.status(200).send({success:true, msg:'chat inserted', data:newchat})
        // const savedChat = { sender_id, reciever_id, message }; // Example response
//   res.json({ success: true, data: savedChat });
    }catch(err){
        res.status(400).send({success:false, msg:err.message})
    }
}
const deleteChat=async(req,res)=>{
    try{
       await chatModel.deleteOne({_id:req.body.id})
       res.status(200).send({success:true})
    }catch(err){
        res.status(400).send({success:false, msg:err.message})
    }
}
module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard, saveChat, deleteChat
};
