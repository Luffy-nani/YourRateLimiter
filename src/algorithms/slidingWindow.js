const redis = require(`../config/redis`)

const slidingWindow = async (userId, limit, windowSize) => {
  const now = Date.now()
  const windowStart = now - (windowSize * 1000)
  const key = `ratelimit:sliding:${userId}`

  await redis.zremrangebyscore(key, 0, windowStart)

  const count = await redis.zcard(key)

  if (count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.ceil(now / 1000) + windowSize
    }
  }

  await redis.zadd(key, now, `${now}-${Math.random()}`)
  await redis.expire(key, windowSize)

  return {
    allowed: true,
    remaining: limit - count - 1,
    resetTime: Math.ceil(now / 1000) + windowSize
  }
}

module.exports = slidingWindow