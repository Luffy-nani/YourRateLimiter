const express=require('express');
const helmet=require(`helmet`);
const cors=require(`cors`);
const dotenv=require(`dotenv`);

dotenv.config();

const app=express();

// Middleware
app.use(helmet())
app.use(express.json()) // To parse the incoming data to json


const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`YourRateLimiter is running on port ${PORT}`);
});

module.exports=app;
