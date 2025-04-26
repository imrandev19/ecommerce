function adminMiddleware(req,res,next){
    if(req.session.user.role == "admin"){
        next()
    }
    else{
        return res.status(400).json({success:false, message: "You are not Authorised/Admin User"})
    }

}

module.exports = adminMiddleware