const express = require('express')
const router = express.Router()
const fixedWindow = require('../algorithms/fixedWindow')

router.post('/check', async (req, res) => {
  try {
    const { userId, limit, windowSize } = req.body
    const result = await fixedWindow(userId, limit, windowSize)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router