import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import {User} from "../models/userSchema.js"
import {generateToken} from "../utils/jwtToken.js"
import cloudinay from "cloudinary"

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


// export const addNewDoctor = catchAsyncError(async(req,res,bext)=>{
//   if(!req.files || Object.keys(req.files).lenght === 0){
//     return next(new ErrorHandler("Doctor Avatar Required",400)) ; 
//   }
//   const {docAvatar} = req.files ;
//   const allawedFormats = ["/image/png","/image/jpeg","/image/webp"] ;
//   if(!allawedFormats.includes(docAvatar.mimetype)){
//     return next(new ErrorHandler("File format not supportd"))
//   }
//   const {firstName , lastName , email , phone , password , gender , dob , Aadhareno,doctorDepartment} = req.body ;
//   if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !Aadhareno ||!doctorDepartment){
//   return next(new ErrorHandler("please fill Full form"));
//   }
//   const isRegistered = await User.findOne({email}) ;
//   if(isRegistered){
//       return next(new ErrorHandler(`${isRegistered.role} already exist with this Email`));
//   }

//   const cloudinaryRespones = await cloudinary.upload(docAvatar.tempFilePath) ;

//   if(!cloudinaryRespones || cloudinaryRespones.error){
//     console.log("cloudinay Error:",cloudinaryRespones.error || "unknow cloudinar error")
//   }
//   const doctor = await User.create({
//     firstName , lastName , email , phone , password , gender , dob , Aadhareno, doctorDepartment, role : "doctor" , docAvatar:{
//       public_id : cloudinaryRespones.public_id,
//       url : cloudinaryRespones.secure_url,
//     }
//   })
//   res.status(200).json({
//  success : true ,
//  message : "New Doctor Registered",
//  doctor
//   })
// })



export const addNewDoctor = catchAsyncError(async (req, res, next) => {
  // ✅ 1. Check if files exist
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required", 400));
  }

  const { docAvatar } = req.files;

  // ✅ 2. Check file format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File format not supported", 400));
  }

  // ✅ 3. Destructure and validate required fields
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    Aadhareno,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !Aadhareno ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please fill the full form", 400));
  }

  // ✅ 4. Check if email already registered
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} already exists with this email`, 400)
    );
  }

  // ✅ 5. Upload avatar to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log("Cloudinary Error:", cloudinaryResponse.error || "Unknown error");
    return next(new ErrorHandler("Failed to upload image", 500));
  }

  // ✅ 6. Create doctor in DB
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    Aadhareno,
    doctorDepartment,
    role: "doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // ✅ 7. Success response
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});