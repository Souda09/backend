import Users from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// register user
const addUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        // validation
        if (!name || !email || !password) {
            return res.json({
                status: false,
                message: "all fields are required"
            });
        }

        // hash password
        const hashpass = await bcrypt.hash(password, 10);

        // user object
        const data1 = {
            name,
            email,
            password: hashpass,
            role: req.body.role
        };

        // save user
        const user = new Users(data1);

        const data = await user.save();

        res.json({
            status: true,
            message: "user created successfully",
            user: data
        });

    } catch (error) {

        console.log("error in creating user --->", error);

        res.json({
            status: false,
            message: error.message
        });

    }
};



// login user
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // validation
        if (!email || !password) {

            return res.json({
                status: false,
                message: "all fields are required",
            });

        }

        // find user
        const user = await Users.findOne({ email });

        if (!user) {

            return res.json({
                status: false,
                message: "cannot find user",
            });

        }

        // compare password
        const decoded = await bcrypt.compare(password, user.password);

        if (decoded) {

            // create token
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET
            );

            // set cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
               
            });

            console.log("");

            return res.json({
                status: true,
                message: "user login successfully",
                user,
                token
            });

        } else {

            return res.status(404).json({
                status: false,
                message: "invalid credentials",
            });

        }

    } catch (error) {

        res.json({
            status: false,
            message: error.message
        });

    }

};



// logout user
const logout = (req, res) => {

    try {

        res.clearCookie("token");

        console.log("logout success");

        res.json({
            status: true,
            message: "user logout successfully",
        });

    } catch (error) {

        res.json({
            status: false,
            message: error.message,
        });

    }

};

export default { addUser, loginUser, logout};