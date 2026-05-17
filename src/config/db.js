import mongoose from "mongoose";

const connectdb = async () =>{
    try{
        console.log('Check String ---->', process.env.MONGOURI);

        await mongoose.connect(process.env.MONGOURI);
        console.log("mongo db connected");

    }
    catch(error){
        console.log("error in database -->", error);

    }
}

export default connectdb