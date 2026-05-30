const jwt=require(`jsonwebtoken`);
const bcrypt=require(`bcryptjs`);

const verifyJWT=async(req,res)=>{
    try{
        const token=req.headers['authorization'].split(' ')[1];
        if(!token){
            return res.status(401).json({err:"Invalid token format"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        return res.status(401).json({error:'Invalid token'})
    }
}