function authMiddleware(req,res,next){
if(req.session.user){
    next()
}else{
    res.status(400).json({success:false, message: "You are not logged in. Please Login First"})
}
}
module.exports = authMiddleware