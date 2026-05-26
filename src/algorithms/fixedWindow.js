const redis=require(`../config/redis`);


const fixedWindow=async (userId, limit,windowSize)=>{
    const windowStart = Math.floor(Date.now() / 1000 / windowSize) * windowSize
    const key = `ratelimit:${userId}:${windowStart}`
    const count=await redis.incr(key);
    let allowed=true;
    if(count==1){
        await redis.expire(key,windowSize);
    }
    if(count>limit){
        allowed=false;
    }

    return {
        allowed: allowed,
        remaining: Math.max(0,limit-count),
        resetTime:windowSize+windowStart,
  }
}

module.exports=fixedWindow;