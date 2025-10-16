import mongoose from "mongoose";

const UserAuthSchema=new mongoose.Schema({
 
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
   
},{timestamps:true})

export default mongoose.model("User",UserAuthSchema);