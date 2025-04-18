function authMiddleware(req,res,next){
if(req.session.user){
    next()
}else{
    res.status(400).json({success:false, message: "Unauthoried User/ You are not logged in"})
}
}
module.exports = authMiddleware