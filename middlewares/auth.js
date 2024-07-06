const isLogin=async(req, res, next)=>{
    try{    
        if(req.session.user){

        }else{
            res.redirect('/')
        }
        next()

    }catch(err){
        console.log(err.message)
    }
}
const isLogout=async(req, res, next)=>{
    try{    
        if(req.session.user){
            res.redirect('/dashboard')
        }
        next()

    }catch(err){
        console.log(err.message)
    }
}

module.exports={isLogin, isLogout}