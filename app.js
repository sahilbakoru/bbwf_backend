const User= require('./models/user')
const express = require("express")
const Router = express.Router()
const mongoose = require("mongoose")
const expressvalidator = require("express-validator")
const config = require ("./config")


require("dotenv").config()


//app 
const app = express()

// import routes 
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
// const categoryRoutes = require("./routes/category")
// const subcategoryRoutes = require("./routes/subcategory")
// const productRoutes = require("./routes/product")
//db
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true,
     
}).then(() => console.log("DB conected"))

//middleware
//app.use(morgan('dev'))
app.use(express.json())
//app.use(cookieParser())
app.use(expressvalidator())
//app.use(cors())
// routes middleware
app.use('/api',authRoutes)
app.use('/api',userRoutes)
// app.use('/api',categoryRoutes)
// app.use('/api',subcategoryRoutes)
// app.use('/api',productRoutes)
const client = require('twilio')(config.accountSID, config.authToken)

// /login
//     - phone number
//     - channel (sms/call)

// /verify
//     - phone number
//     - code



// Login Endpoint
app.get('/login', (req,res) => {
     if (req.query.phonenumber) {
        client
        .verify
        .services(config.serviceId)
        .verifications
        .create({
            to: `+${req.query.phonenumber}`,
            channel: req.query.channel==='call' ? 'call' : 'sms' 
        })
        .then(data => {
            res.status(200).send({
                message: "Verification is sent!!",
                phonenumber: req.query.phonenumber,
                data
            })
        }) 
     } else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.query.phonenumber,
            data
        })
     }
})

// Verify Endpoint
app.get('/verify', (req, res) => {
    if (req.query.phonenumber && (req.query.code).length === 4) {
        client
            .verify
            .services(config.serviceId)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phonenumber: req.query.phonenumber,
            data
        })
    }
})



app.get('/signup' , async(req , res)=>{
    try{
        const user = await User.find({refrence:"9050615561"},{_id:0,name:1})
        res.json(user)

    }catch(err){
        res.json({message:err})

    }  
 
 })




const port = process.env.PORT || 8001

app.listen(port , ()=>{
    console.log(`hello from simple server ${port}`)
})
