import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [5, "minimum 5 required"]
    },

    email: {
        type: String,
        unique: true,
        required: true
    },


    password: {
        type: String,
        required: true,
        minLength: [8, "min 8 characters"]
    },


// yah admin k ley role ka schema banae gay 
role: {
        type: String,
        enum: ['user', 'admin'],    // enum validate or restricted karta ha or yah case sensative hota ha
        default: 'user'            // by default user consider karta ha 
    }

},
    {
        timestamps: true
    }

)


const Users = mongoose.model("user", UserSchema)
export default Users