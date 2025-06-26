import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import {User} from "../models/userSchema.js"

export const patientRegister = catchAsyncError(async(req,res,next)=> {
    const {firstName , lastName , email , phone , password , gender , dob , Aadhareno,role} = req.body ;
    if(!firstName || !lastName ||  !email || !phone || !password || !gender || !dob || !Aadhareno || !role){
        return next (new ErrorHandler("plesase fill full form !" , 400)) ;
    }
    let user = await User.findOne({email}) ; 
    if(user) {
         return next (new ErrorHandler("User Already availabe in this email !" , 400))
    }
    user = await User.create({firstName , lastName , email , phone , password , gender , dob , Aadhareno,role})  ;
    res.status(200).json({
        success : true ,
        message : "User Registered !",
    })
})