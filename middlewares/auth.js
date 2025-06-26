import {catchAsyncError} from "./catchAsyncError.js"
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"



export const isAdminAuthenticate = catchAsyncError(async(req , res , next) =>{
    const token = req.cookies.addminToken ;
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticated" ,400));
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Admin"){
        return next(new ErrorHandler(`${req.user.role} not authorized for this resources`))
    }
    next();
})

export const isPatientAuthenticate = catchAsyncError(async(req , res , next) =>{
    const token = req.cookies.patientToken ;
    if(!token){
        return next(new ErrorHandler("patient Not Authenticated" ,400));
    }
    const decoded = jwt.veirfy (token , process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "patient"){
        return next(new ErrorHandler(`${req.user.role} not authorized for this resources`))
    }
    next();
})

