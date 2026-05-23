// import mongoose from "mongoose";

// const connectdb = async () =>{
//     try{
//         console.log('Check String ---->', process.env.MONGOURI);

//         await mongoose.connect(process.env.MONGOURI);
//         console.log("mongo db connected");

//     }
//     catch(error){
//         console.log("error in database -->", error);

//     }
// }

// export default connectdb











import mongoose from 'mongoose';

const connectdb = async () => {
    // Agar pehle se connected hai, toh dobara connect na karein
    if (mongoose.connection.readyState >= 1) {
        console.log("Using existing database connection");
        return;
    }

    try {
        console.log("Creating new database connection...");
        const conn = await mongoose.connect(process.env.MONGOURI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds mein agar connect na ho toh fail ho jaye (10s tak na ruke)
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error ❌: ${error.message}`);
    }
};

export default connectdb;