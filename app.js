const User= require('./models/abcd')
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
const { $where } = require('./models/abcd')
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
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });   
//app.use(cookieParser())
app.use(expressvalidator())
//app.use(cors())
// routes middleware
app.use('/api',authRoutes)
app.use('/api',userRoutes)
// app.use('/api',categoryRoutes)
// app.use('/api',subcategoryRoutes)
// app.use('/api',productRoutes)
const client = require('twilio')(config.accountSID, config.authToken,config.serviceId)

// /login
//     - phone number
//     - channel (sms/call)

// /verify
//     - phone number
//     - code



// Login Endpoint
app.post(`/send-verification-otp`, (req, res) => {
    const { phoneInput } = req.body;
  console.log(req.query, req.body)
  
    client.verify
      .services(config.serviceId)
      .verifications.create({ to: "+91" + phoneInput, channel: "sms" })
      .then((verification) => {
        return res.status(200).json({ verification });
      })
      .catch((error) => {
        return res.status(400).json({ error });
      });
  });

// Verify Endpoint
app.post(`/verify-otp`, (req, res) => {
    const { phoneInput, code } = req.body;
    console.log(req.query, req.body)
    client.verify
      .services(config.serviceId)
      .verificationChecks.create({ to: "+91" + phoneInput, code })
      .then((verification_check) => {
        return res.status(200).json({ verification_check });
      })
      .catch((error) => {
        return res.status(400).json({ error });
      });
  });



// refrence users.
app.get('/signup' , async(req , res)=>{
    try{
        const user2 = await User.find({refrence:"545555555"},{_id:0,name:1})
        res.json(user2)

    }catch(err){
        res.json({message:err})
    }  
 
 })



 // total user below.
 app.get('/total' , async(req , res)=>{
    try{
        const user = await User.find({ id: { $gte: 2 + 1}}).count()
        res.json(user)
        
        if (user < 2) {
            console.log("opps looks like you hasn't reach 100 users yet ")
          } else if (user < 3) {
            console.log("you have 100 rs")
          }
          else if (user < 4) {
            console.log("you have 200 rs")
          } else {
            console.log("somthing wrong.")
          }

    }catch(err){
        res.json({message:err})

    }  
 
 })









 //port 
const port = process.env.PORT || 8001

app.listen(port , ()=>{
    console.log(`hello from simple server ${port}`)
})
