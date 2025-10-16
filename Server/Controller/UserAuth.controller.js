import UserAuthSchema from "../Model/UserAuth.model";


export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await UserAuthSchema.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        if(user.password!==password){
            return res.status(400).json({message:"Invalid password"});
        }
        res.status(200).json({message:"Login successful",user});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}
