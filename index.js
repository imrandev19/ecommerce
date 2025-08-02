const express = require("express")
const app = express()
let cors = require('cors')

require('dotenv').config()
const PORT = process.env.PORT || 3000
const session = require('express-session')
const MongoStore = require('connect-mongo');
const adminMiddleware = require("./middleware/adminMiddleware")
app.use(cors())
app.use(session({
    secret: process.env.SESSIONSECREET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24*60*60*1000 },
    name: "ecommerceSessionCookie",
    store: MongoStore.create({ mongoUrl: process.env.DB_LINK })
  }))
  
const router = require('./router')
const ConnectDB = require("./Config/db")
app.get('/authoriseduserpage', adminMiddleware,(req,res)=>{
    res.send(req.session.user)
})

app.use(express.json())
app.use(express.static('uploads'))
app.use(router)


ConnectDB()
//http://localhost:4000
app.listen(PORT, ()=>
    console.log(`Server is running at http://localhost:${PORT}`)
)