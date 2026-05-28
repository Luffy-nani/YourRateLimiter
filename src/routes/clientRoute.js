const express=require(`express`);
const verifyApiKey = require("../middleware/verifyApiKey");
const { registerClient, getClients, updateRules, deactivateClient,rotateApiKey } = require('../controllers/clientController');
const router=express.Router();

router.post('/register',registerClient);
router.get('/me', verifyApiKey, getClients)
router.put('/rules', verifyApiKey, updateRules)
router.delete('/', verifyApiKey, deactivateClient)
router.post('/rotate-key', verifyApiKey, rotateApiKey) // Not put because rotating a key is an action (Actually either works but yeah post is better)

module.exports=router;