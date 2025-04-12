const express = require("express")
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000
const router = require('./router')
const ConnectDB = require("./Config/db")

app.use(router)
ConnectDB()
//http://localhost:4000
app.listen(PORT, ()=>
    console.log(`Server is runnin at http://localhost:${PORT}`)
)