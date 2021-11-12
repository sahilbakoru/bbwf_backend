const User= require('./models/user')
const express = require("express")
const Router = express.Router()
const mongoose = require("mongoose")
const expressvalidator = require("express-validator")


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


app.get('/signup' , async(req , res)=>{
    try{
        const user = await User.find()
        res.json(user)

    }catch(err){
        res.json({message:err})

    }  
 
 })




const port = process.env.PORT || 8001

app.listen(port , ()=>{
    console.log(`hello from simple server ${port}`)
})

