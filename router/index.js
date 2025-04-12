const express = require ("express")
const router = express.Router()
const apiRouter = require("./api")
router.use('/api/v1', apiRouter)
router.use((req,res)=>{
    return res.status(404).json({success:false, message: "Route Not found"})
})
// http://localhost:4000/api/v1
module.exports = router
