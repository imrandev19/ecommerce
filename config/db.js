const { default: mongoose } = require("mongoose")

async function ConnectDB() {
    const DB_LINK = process.env.DB_LINK
    mongoose.connect(DB_LINK).then(()=>{
        console.log("DB Connected")
    }).catch((err)=>{
        console.log(err)
    })

}

module.exports = ConnectDB