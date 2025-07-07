import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import Errorhandler from "../middlewares/errorMiddleware.js"
import { Appointment } from "../models/appointmentSchema.js"
import { User } from "../models/userSchema.js"

export const postAppointment = catchAsyncError(async (req, res, next) => {
    const {

        firstName, 
        lastName,
        email,
        phone,
        Aadhareno,
        dob,
        gender,
        appointmentDate,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
        status,
} = req.body;


if(
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !Aadhareno ||
    !dob ||
    !gender ||
    !appointmentDate ||
    !doctor_firstName ||
    !doctor_lastName ||
    !hasVisited ||
    !address){
 return next(new Errorhandler("Please fill all required fields", 400));
}

const isConflict = await User.find({
    firstName : doctor_firstName,
    lastName : doctor_lastName,
    role : "Doctor",
    doctorDepartment : department 
})

if(isConflict.lenght === 0) {
    return next ( new Errorhandler("doctor not found ",400))
}
if(isConflict.lenght === 0) {
    return next ( new Errorhandler("doctor Conflict ! please Contact Through Email or Phone ",400))
}



})