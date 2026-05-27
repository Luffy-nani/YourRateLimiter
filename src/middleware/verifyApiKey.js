const bcrypt=require(`bcryptjs`);
const Client=require(`../models/client`);

const verifyApiKey=async(req,res,next)=>{
    try{
            const apiKey=req.headers['x-api-key'];
    if(!apiKey){
        return res.status(401).json({error:"API key required"});
    }

    const keyPrefix=apiKey.substring(0,10);
    const client=await Client.findOne({keyPrefix});

    if(!client){
        return res.status(401).json({error:"Invalid API Key"});
    }

    const isValid=bcrypt.compare(apiKey,client.apiKey);
    if(!isValid){
        return res.status(401).json({error:"Invalid API key"});
    }

    if(!client.isActive){
        return res.status(403).json({error:"Client disabled"});
    }

    req.client=client
    next();
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
}

module.exports=verifyApiKey;