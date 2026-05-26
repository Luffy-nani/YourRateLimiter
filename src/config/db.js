const mongoose=require(`mongoose`);

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo db connected");
    }
    catch(err){
        console.error("Mongo db error: ",err);
        process.exit(1);
    }
}

module.exports=connectDB;