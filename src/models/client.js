const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    unique: true,
    required: true
  },
  rules: [
    {
      endpoint: { type: String, default: '*' },
      algorithm: { type: String, enum: ['fixed', 'sliding', 'token'], default: 'fixed' },
      limit: { type: Number, required: true },
      windowSize: { type: Number, required: true }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Client', clientSchema)