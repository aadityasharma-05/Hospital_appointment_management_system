import express from "express" ; 
import { getAllMessage, sendMessage } from "../controller/messageController.js";
import { isAdminAuthenticate } from "../middlewares/auth.js"
const router = express.Router() ; 


router.post("/send" , sendMessage) ;
router.get("/getAll ",isAdminAuthenticate,getAllMessage)

export default router ;