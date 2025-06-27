// import {catchAsyncError} from "./catchAsyncError.js"
// import ErrorHandler from "./errorMiddleware.js";
// import jwt from "jsonwebtoken"



// export const isAdminAuthenticate = catchAsyncError(async(req , res , next) =>{
//     const token = req.cookies.adminToken ;
//     if(!token){
//         return next(new ErrorHandler("Admin Not Authenticated" ,400));
//     }
//     const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     if(req.user.role !== "Admin"){
//         return next(new ErrorHandler(`${req.user.role} not authorized for this resources`))
//     }
//     next();
// })

// export const isPatientAuthenticate = catchAsyncError(async(req , res , next) =>{
//     const token = req.cookies.patientToken ;
//     if(!token){
//         return next(new ErrorHandler("patient Not Authenticated" ,400));
//     }
//     const decoded = jwt.verify (token , process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     if(req.user.role !== "patient"){
//         return next(new ErrorHandler(`${req.user.role} not authorized for this resources`))
//     }
//     next();
// })

import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js"; // Don't forget this

// Admin Auth
export const isAdminAuthenticate = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.adminToken; // ✅ FIXED

  if (!token) {
    return next(new ErrorHandler("Admin Not Authenticated", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // ✅ FIXED
  req.user = await User.findById(decoded.id);

  if (!req.user || req.user.role !== "Admin") {
    return next(new ErrorHandler(`${req.user?.role || "User"} not authorized for this resource`, 403));
  }

  next();
});

// Patient Auth
export const isPatientAuthenticate = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.patientToken;

  if (!token) {
    return next(new ErrorHandler("Patient Not Authenticated", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // ✅ FIXED
  req.user = await User.findById(decoded.id);

  if (!req.user || req.user.role !== "patient") {
    return next(new ErrorHandler(`${req.user?.role || "User"} not authorized for this resource`, 403));
  }

  next();
});
