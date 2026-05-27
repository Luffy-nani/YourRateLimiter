const registerClient=require(`../controllers/clientController`);
const express=require(`express`);
const router=express.Router();

router.post('/register',registerClient);

module.exports=router;