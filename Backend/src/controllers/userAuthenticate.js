const redisClient=require('../config/redis');
const User=require('../models/users');
const validate=require('../utils/validators');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Submission=require('../models/submission');

 

const register=async (req,res)=>{

    try{
     //validate the data 
     validate(req.body);

        const{firstName,emailId,password}=req.body;
 
        //check if user already exists
        //const ans=User.exists({emailId});

        req.body.password=await bcrypt.hash(password,10);
        req.body.role='user'; //they always register as user

      

       const user= await User.create(req.body);  //already check if user already exist or not
       
       const token=  jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
        const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        _id:user._id
       }

       res.cookie('token',token,{maxAge:60*60*1000});
    //    res.status(201).send("User Registered Successfully")
        res.status(201).json({
        user:reply,
        message:"Logged in Successfully"
    })


    }
    catch(err){
        res.status(400).send("Error: "+err);

    }
}

const login=async(req,res)=> {

    try{
       const {emailId,password}=req.body;

       if(!emailId)
        throw new Error("Invalid credentials")

       if(!password)
        throw new Error("Invalid credentials");

       const user=await User.findOne({emailId});  //find user

       const match= await bcrypt.compare(password,user.password);

       if(!match)
        throw new Error("Invalid credentials");

       const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        _id:user._id
       }

       const token=  jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
       res.cookie('token',token,{maxAge:60*60*1000});
    //    res.status(200).send("Logged in Successfully");
    res.status(201).json({
        user:reply,
        message:"Logged in Successfully"
    })
    }
    catch(err) {
        res.status(401).send("Error: "+err);

    }
}

const logout=async(req,res)=>{
    try{
        const {token}=req.cookies;

        const payload=jwt.decode(token);
        
        await redisClient.set(`token: ${token}`,'Blocked');
        await redisClient.expireAt(`token: ${token}`,payload.exp);

        //token add kar dunga redis ke blocklist mein
        //clear cookies

        res.cookie("token",null,{expires:new Date(Date.now())});
        res.status(503).send("Logged Out Successfully");
    }
    catch{
        res.send("Error: "+err);

    }
}

const adminRegister=async(req,res)=>{
     try{

        // if(req.result.role!='admin')
        //     throw new Error("Invalid credentials");
  
     validate(req.body);

        const{firstName,emailId,password}=req.body;

        req.body.password=await bcrypt.hash(password,10);
        req.body.role='admin'; //they always register as admin

      

       const user= await User.create(req.body);  //already check if user already exist or not
       const token=  jwt.sign({_id:user._id,emailId:emailId,role:'admin'},process.env.JWT_KEY,{expiresIn:60*60});
       res.cookie('token',token,{maxAge:60*60*1000});
       res.status(201).send("User Registered Successfully")

    }
    catch(err){
        res.status(400).send("Error: "+err);

    }
}

const deleteProfile=async(req,res)=>{

    try{
        const userId=req.result._id;
        //delete from userSchema
        await User.findByIdAndDelete(userId);

        //also delete from submission

       await Submission.deleteMany({userId});

       res.status(200).send("profile deleted successfully");

    }
    catch(err){

        res.status(500).send("Internal Server Error");

    }

}

module.exports={register,login,logout,adminRegister,deleteProfile};