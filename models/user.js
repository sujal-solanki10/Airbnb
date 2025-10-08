const { required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose  = require("passport-local-mongoose");

const userSchma = new schema({
    email:{
        type:String,
        required:true
    }
})

userSchma.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchma);