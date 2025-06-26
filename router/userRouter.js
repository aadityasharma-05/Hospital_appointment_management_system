import express from "express" 
import {addNewAdmin, login , patientRegister } from "../controller/userController.js";
import {isAdminAuthenticate,isPatientAuthenticate} from "../middlewares/auth.js"
const router = express.Router() ;

router.post("/patient/register" , patientRegister) ; 

router.post("/login" , login) ; 

router.post("/admin/adminnew" , addNewAdmin) ;

router.post("/admin/addnew" , isAdminAuthenticate ,addNewAdmin)

export default router ; 