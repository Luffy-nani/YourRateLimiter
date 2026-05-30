const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/user')
const jwt = require('jsonwebtoken')

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
}, async(accessToken,refreshToken,profile,done)=>{
    try{
        
        let user=await User.findOne({githubId:profile.id})
        if (!user) {
          user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value
      })
    }
    const token=jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
    return done(null,{user,token});
    }
    catch(err){
        return done(err);
    }
}
));
module.exports=passport;