import express from "express" 
import {addNewAdmin, getALLDoctors, getUserDetail, login , logoutAdmin, logoutPatient, patientRegister } from "../controller/userController.js";
import {isAdminAuthenticate,isPatientAuthenticate} from "../middlewares/auth.js"
const router = express.Router() ;

router.post("/patient/register" , patientRegister) ; 

router.post("/login" , login) ; 

router.post("/admin/adminnew" , addNewAdmin) ;

router.post("/admin/addnew" , isAdminAuthenticate ,addNewAdmin) ;

router.get("/doctors" , getALLDoctors)

router.get("/admin/me" , isAdminAuthenticate ,getUserDetail) ;

router.get("/patient/me" , isPatientAuthenticate, getUserDetail) ;

router.get("/admin/logout"  ,logoutAdmin) ;

router.get("/patient/logout" ,logoutPatient) ;


export default router ; 