const verifyKey = require('../middleware/verifyApiKey')
const express = require('express')
const router = express.Router()
const slidingWindow = require('../algorithms/slidingWindow')
const fixedWindow = require('../algorithms/fixedWindow')
const AuditLog = require('../models/auditLog')

const algorithms = {
  sliding: slidingWindow,
  fixed: fixedWindow
}

router.post('/check', verifyKey, async (req, res) => {
  try {
    const client = req.client
    const { userId, endpoint } = req.body

    const rule = client.rules.find(r => r.endpoint === endpoint)
              || client.rules.find(r => r.endpoint === '*')

    if (!rule) {
      return res.status(404).json({ error: 'No rule found for this endpoint' })
    }

    const algo = algorithms[rule.algorithm]
    const result = await algo(userId, rule.limit, rule.windowSize)
    res.set({
      'X-RateLimit-Limit': rule.limit,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Reset': result.resetTime
    });

    AuditLog.create({
      clientId: req.client._id,
      userId,
      endpoint,
      allowed: result.allowed,
      remaining: result.remaining
    }).catch(err => console.error(err));
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router