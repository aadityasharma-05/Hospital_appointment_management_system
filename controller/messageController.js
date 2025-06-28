import {catchAsyncError} from '../middlewares/catchAsyncError.js'
 import ErrorHandler  from "../middlewares/errorMiddleware.js"


import { Message } from "../models/messageSchema.js" ; 


export const sendMessage = catchAsyncError (async ( req , res , next ) => {
    const { firstName , lastName , email , phone , message} = req.body  || {} ;

    if(!firstName || !lastName || !email || !phone || !message){
        // return res.status(400).json({
        //     success : false ,
        //     message : "please Fill Full From",
        // }) ; 
        return next( new ErrorHandler("please Fill Full From",400))
    }
        await Message.create({firstName , lastName , email , phone,message}) ;
        res.status(200).json({
            success : true ,
            message : " Message Send Successfully",
        });
    
})

export const getAllMessage = catchAsyncError(async(req,res,next) => {
    const message = await Message.find()
    res.status(200).json({
        success : true ,
        message,
    })
})