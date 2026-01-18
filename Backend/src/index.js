const express=require('express');
const app=express();
require('dotenv').config();
const main=require("./config/db")
const cookieParser=require('cookie-parser');
const authRouter=require("./routes/userAuth");
const redisClient=require('./config/redis');
const problemRouter=require('./routes/problemCreator');
const submitRouter=require('./routes/submit');
const aiRouter=require('./routes/aiChatting')
const videoRouter=require('./routes/videoCreator');
const cors=require('cors');

app.use(cors({
    origin:'https://stirring-phoenix-09c593.netlify.app',
    credentials:true
}))


app.use(express.json()); 
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter); 
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);

const InitializeConnection=async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connectes");

         app.listen(process.env.PORT,()=>{
             console.log('Server is running on port:'+process.env.PORT);
})
 
    }
    catch(err){
        console.log("Error: "+err);

    } 
}

InitializeConnection(); 


 
