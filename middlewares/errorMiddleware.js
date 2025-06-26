// class ErrorHandler extends Error {
//     constructor(message , statusCode) {
//         super(message);
//         this.statusCode = statusCode;
//     }
// }

// export const errorMiddleware = (err ,req , res , next ) => {
//     err.message = err.message || "Internal Server Error" ;
//     err.statusCode = err.statusCode || 500 ;

//     if(err.code === 11000){
//         const message = `Duplicate ${Object.keys(err.keyValue)} Entered` ;
//         err = new ErrorHandler(message , 400) ;
//     }

//       if(err.name === "jsonWebTokenError"){
//         const message = "json web token is invalid , try Again!" ;
//         err = new ErrorHandler(message , 400) ;
//     }

//        if(err.name === "TokenExpiredError"){
//         const message = "json web token is expired , try Again!" ;
//         err = new ErrorHandler(message , 400) ;
//     }

//        if(err.name === "CastError"){
//         const message = `Invalid ${err.path}` ;
//         err = new ErrorHandler(message , 400) ;
//     }

//      return res.status(err.statusCode).json({
//         success : false ,
//         message : err.message,
//      })
// }

// export default ErrorHandler ;
// ErrorHandler class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Preserve proper stack trace (only in V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error middleware function
export const errorMiddleware = (err, req, res, next) => {
  // Set default error message and status code
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Duplicate key error (like unique email, etc.)
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    err = new ErrorHandler(message, 400);
  }

  // Invalid JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again!";
    err = new ErrorHandler(message, 400);
  }

  // Expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Please login again!";
    err = new ErrorHandler(message, 400);
  }

  // CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new ErrorHandler(message, 400);
  }

  // Send the final error response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
