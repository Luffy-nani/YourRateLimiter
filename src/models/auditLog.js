const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  allowed: {
    type: Boolean,
    required: true
  },
  remaining: {
    type: Number
  }
}, { timestamps: true })

module.exports = mongoose.model('AuditLog', auditLogSchema)