// import Users from "../models/UserSchema.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";


// // register user
// const addUser = async (req, res) => {

//     const { name, email, password } = req.body;

//     try {

//         // validation
//         if (!name || !email || !password) {
//             return res.json({
//                 status: false,
//                 message: "all fields are required"
//             });
//         }

//         // hash password
//         const hashpass = await bcrypt.hash(password, 10);

//         // user object
//         const data1 = {
//             name,
//             email,
//             password: hashpass,
//             role: req.body.role
//         };

//         // save user
//         const user = new Users(data1);

//         const data = await user.save();

//         res.json({
//             status: true,
//             message: "user created successfully",
//             user: data
//         });

//     } catch (error) {

//         console.log("error in creating user --->", error);

//         res.json({
//             status: false,
//             message: error.message
//         });

//     }
// };



// // login user
// const loginUser = async (req, res) => {

//     try {

//         const { email, password } = req.body;

//         // validation
//         if (!email || !password) {

//             return res.json({
//                 status: false,
//                 message: "all fields are required",
//             });

//         }

//         // find user
//         const user = await Users.findOne({ email });

//         if (!user) {

//             return res.json({
//                 status: false,
//                 message: "cannot find user",
//             });

//         }

//         // compare password
//         const decoded = await bcrypt.compare(password, user.password);

//         if (decoded) {

//             // create token
//             const token = jwt.sign(
//                 {
//                     id: user._id,
//                     email: user.email,
//                     role: user.role
//                 },
//                 process.env.JWT_SECRET
//             );

//             // set cookie
//             res.cookie("token", token, {
//                 httpOnly: true,
//                 secure: true,
               
//             });

//             console.log("");

//             return res.json({
//                 status: true,
//                 message: "user login successfully",
//                 user,
//                 token
//             });

//         } else {

//             return res.status(404).json({
//                 status: false,
//                 message: "invalid credentials",
//             });

//         }

//     } catch (error) {

//         res.json({
//             status: false,
//             message: error.message
//         });

//     }

// };



// // logout user
// const logout = (req, res) => {

//     try {

//         res.clearCookie("token");

//         console.log("logout success");

//         res.json({
//             status: true,
//             message: "user logout successfully",
//         });

//     } catch (error) {

//         res.json({
//             status: false,
//             message: error.message,
//         });

//     }

// };

// export default { addUser, loginUser, logout};











import Users from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// register user
const addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        const hashpass = await bcrypt.hash(password, 10);

        const data1 = {
            name,
            email,
            password: hashpass,
            role: role || 'user' // Agar role nahi bheja toh default 'user'
        };

        const user = new Users(data1);
        const data = await user.save();

        // Safe client object banayein bina password ke
        const safeUser = data.toObject();
        delete safeUser.password;

        res.status(201).json({
            status: true,
            message: "User created successfully 🎉",
            user: safeUser
        });

    } catch (error) {
        console.log("Error in creating user --->", error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Cannot find user with this email",
            });
        }

        const decoded = await bcrypt.compare(password, user.password);

        if (decoded) {
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' } // Token expiry standard practice hai
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none' // Vercel deployment par cross-site cookies ke liye zaroori hai
            });

            // Password frontend par bhejney ki zaroorat nahi hoti
            const safeUser = user.toObject();
            delete safeUser.password;

            console.log(`User Logged In Successfully: ${safeUser.email} [Role: ${safeUser.role}] 🚀`);

            return res.status(200).json({
                status: true,
                message: "User login successfully",
                user: safeUser,
                token
            });

        } else {
            return res.status(401).json({ // 401 Unauthorized password ke liye best hai
                status: false,
                message: "Invalid credentials",
            });
        }

    } catch (error) {
        console.error("Error during login backend:", error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// logout user
const logout = (req, res) => {
    try {
        res.clearCookie("token");
        console.log("Logout success 🛑");
        res.status(200).json({
            status: true,
            message: "User logout successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

export default { addUser, loginUser, logout };