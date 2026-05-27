const Client = require('../models/client')
const crypto = require('crypto')  // no need to install this...default present in node js
const bcrypt = require('bcryptjs')

const registerClient = async (req, res) => {
  try {
    const { appName, rules } = req.body

    const apiKey = 'rl_' + crypto.randomBytes(32).toString('hex')
    const hashedApiKey = await bcrypt.hash(apiKey, 10)
    const keyPrefix = apiKey.substring(0, 10);

    const client = new Client({
      appName,
      rules,
      apiKey: hashedApiKey,
      isActive: true,
      keyPrefix
    })

    await client.save()

    res.json({
      message: 'Client registered successfully',
      appName: client.appName,
      apiKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = registerClient