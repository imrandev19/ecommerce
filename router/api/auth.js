const express = require ("express")
const router = express.Router()
// http://localhost:4000/api/auth/v1/signup
router.post('/signup',(req,res)=>{
    res.send("Sign Up Route")
})

module.exports = router