const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const crypto=require(`crypto`);

const tempCodes=new Map();

router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}))

router.get('/github/callback',
    passport.authenticate('github',{session:false,failureRedirect:'/auth/failed'}),
    //no need to be async since we dont use any awaits here
    (req,res)=>{
        const {token}=req.user

        const code=crypto.randomBytes(16).toString('hex');
        tempCodes.set(code,token);

        setTimeout(()=>{
            tempCodes.delete(code)
        }, 60000) // To delete the code(Expiryy!)

        res.redirect(`http://localhost:5173?code=${code}`)
    }  
)

router.get('/token',(req,res)=>{
    const code=req.query

    const token=tempCodes.get(code);
    if(!token){
        return res.status(401).json({error:"Invalid code or expired"});
    }

    tempCodes.delete(code);
    res.json({token});
})

router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'GitHub authentication failed' })
})

module.exports = router