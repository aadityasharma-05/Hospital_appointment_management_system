import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import {User} from "../models/userSchema.js"
import {generateToken} from "../utils/jwtToken.js"

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
    generateToken(user ,"user Registered!" ,200 ,res)
  
})

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please provide all details", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and Confirm Password do not match!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("User with this role not found", 400));
  }
generateToken(user , "User login succesfully!" , 200 , res) ;
 
});

export const addNewAdmin = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, dob, Aadhareno } = req.body;

  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !Aadhareno) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorHandler("Admin with this email already exists", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    Aadhareno,
    role: "Admin"
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered!",
  });
});

export const getALLDoctors = catchAsyncError(async(req,res,next) => {
    const doctors = await User.find({role : "Doctor"});
    res.status(200).json({
        success : true,
        doctors
    })
} )

export const getUserDetail = catchAsyncError(async(req ,res ,next) => {
  const user = req.user ;
  res.status(200).json({
    success : true ,
    user,
  })
})

export const logoutAdmin = catchAsyncError(async (req, res, next) => {
  res.status(200)
    .cookie("adminToken", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production"
    })
    .json({
      success: true,
      message: "Admin logged out successfully"
    });
});

export const logoutPatient = catchAsyncError(async (req, res, next) => {
  res.status(200)
    .cookie("patientToken", "", {
      expires: new Date(0), // Set cookie to expire
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production"
    })
    .json({
      success: true,
      message: "Patient logged out successfully"
    });
});



