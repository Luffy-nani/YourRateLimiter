const crypto=require(`crypto`);
const Client=require(`../models/client`);

const verifyApiKey=async(req,res,next)=>{
    try{
            const apiKey=req.headers['x-api-key'];
    if(!apiKey){
        return res.status(401).json({error:"API key required"});
    }
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')
    const client = await Client.findOne({ apiKey: hashedKey })

    if(!client){
        return res.status(401).json({error:"Invalid API Key"});
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