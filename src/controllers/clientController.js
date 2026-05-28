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

const getClients=async(req,res)=>{
    try{
        return res.json({
          appName:req.client.appName,
          rules:req.client.rules,
          isActive:req.client.isActive
        });
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

const updateRules = async (req, res) => {
  try {
    const { rules } = req.body
    req.client.rules = rules
    await req.client.save()
    res.json({ message: 'Rules updated', rules: req.client.rules })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deactivateClient=async(req,res)=>{
    try{
        req.client.isActive=false;
        await req.client.save();
        res.json({message:"Client deactivated"});
    }
    catch(err){
      res.status(500).json({message:err.message});
    }
}

const rotateApiKey = async (req, res) => {
  try {
    const apiKey = 'rl_' + crypto.randomBytes(32).toString('hex')
    const hashedApiKey = await bcrypt.hash(apiKey, 10)
    const keyPrefix = apiKey.substring(0, 10)

    req.client.apiKey = hashedApiKey
    req.client.keyPrefix = keyPrefix
    await req.client.save()

    res.json({ 
      message: 'API key rotated successfully',
      apiKey  // show new key once
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { registerClient, getClients, updateRules, deactivateClient,rotateApiKey}