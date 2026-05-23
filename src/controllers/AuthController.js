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

// ==========================================
// REGISTER USER
// ==========================================
const addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        // 2. Hash password
        const hashpass = await bcrypt.hash(password, 10);

        // 3. Create user instance
        const newUser = new Users({
            name,
            email,
            password: hashpass,
            role: role || 'user'
        });

        const savedUser = await newUser.save();

        // 4. Safe user object creation (Without Password)
        const safeUser = {
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role
        };

        return res.status(201).json({
            status: true,
            message: "User created successfully 🎉",
            user: safeUser
        });

    } catch (error) {
        console.error("Error in creating user --->", error);
        return res.status(500).json({
            status: false,
            message: "Server Error: " + error.message
        });
    }
};

// ==========================================
// LOGIN USER
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        // 2. Find user in Database
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Cannot find user with this email",
            });
        }

        // 3. Verify Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // 4. Check JWT Secret Guard (To prevent 500 crashes)
            if (!process.env.JWT_SECRET) {
                console.error("CRITICAL ERROR: process.env.JWT_SECRET is not defined! Check Vercel Env Settings.");
                return res.status(500).json({
                    status: false,
                    message: "Database setup error: JWT Secret is missing from server env."
                });
            }

            // 5. Generate JWT Token
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role || 'user'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // 6. Set Browser Cookie safely for Cross-Origin deployment (Vercel)
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'none' 
            });

            // 7. Clean User Object (No password data sent to frontend)
            const safeUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            };

            console.log(`User Logged In Successfully: ${safeUser.email} [Role: ${safeUser.role}] 🚀`);

            return res.status(200).json({
                status: true,
                message: "User login successfully",
                user: safeUser,
                token
            });

        } else {
            return res.status(401).json({ 
                status: false,
                message: "Invalid credentials",
            });
        }

    } catch (error) {
        console.error("Error during login backend:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error: " + error.message
        });
    }
};

// ==========================================
// LOGOUT USER
// ==========================================
const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        
        console.log("Logout success 🛑");
        return res.status(200).json({
            status: true,
            message: "User logout successfully",
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({
            status: false,
            message: "Logout failed: " + error.message,
        });
    }
};


// admin
// Temporary function to make any user an admin
const makeAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: false, message: "Email is required" });
        }

        // Database mein user ko dhoond kar uska role 'admin' kar dega
        const updatedUser = await Users.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true } // Yeh updated data return karega
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found with this email" });
        }

        return res.status(200).json({
            status: true,
            message: `Success! ${email} is now an ADMIN. 🚀`,
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// Phir export mein isko add kar dein
export default { addUser, loginUser, logout, makeAdmin };

