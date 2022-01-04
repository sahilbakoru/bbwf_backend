const mongoose = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid').v4
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = new mongoose.Schema({ 

    name :{
        type:String,
        trim:true,
        require:true,
        maximum:32
    },

    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
        
    },
    fathername:{
        type:String,
        trim:true,
        require:true,
        maxlenth:32
    },
    phone:{
        type:Number,
        maxlength:10,
        unique:true
    },
    refrence:{
        type:Number,
        unique:false,
        maxlenth:10,
        required:false
    },
    refralIds:[mongoose.Schema.Types.ObjectId],

    adhar:{
        type:Number,
        default:0
    },
    pan:{
        type:String,
        default:0
    },
    hashed_password:{
        type:String,
        required:true,
        
    },


    address:{
        type:String,
        
    },

    salt:String,
     
},{timestamps:true})

// virtual field 
userSchema.plugin(AutoIncrement, {inc_field: 'id'});

userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuid() 
    this.hashed_password=this.encryptPassword(password)

})
.get(function(){
    return this._password
})

userSchema.methods = {

    authenticte:function(plaintext){
        return this.encryptPassword(plaintext)===this.hashed_password
    },



    encryptPassword:function(password) {
        if(!password) return''
        try {
            return crypto
                             .createHmac("sha1",this.salt)
                             .update(password)
                             .digest("hex");   
        }catch(err) {
            return"";
        }
    }
}

// // this code check if phone already exist in database or not
// userSchema.path('phone').validate(async (phone) => {
// const phoneCount = await mongoose.models.abcd.countDocuments({ phone })
// return ! phoneCount
// }, 'phone already exists')

//     // this code check if adharcard already exist in database or not
// userSchema.path('adhar').validate(async (adhar) => {
//     const adharCount = await mongoose.models.abcd.countDocuments({ adhar })
//     return ! adharCount
//     }, 'Adharcard already exists')
//     // this code check if pan already exist in database or not
// userSchema.path('pan').validate(async (pan) => {
//     const panCount = await mongoose.models.abcd.countDocuments({ pan })
//     return ! panCount
//     }, 'Pancard already exists')



module.exports = mongoose.model("abcd",userSchema);