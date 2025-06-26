import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL , {
        dbName : "hospital_project"
    } ).then(() =>{
        console.log("database conneted ")
    }).catch(err=>{
        console.log(`Some error occured while connention : ${err} `) ;
    })
}