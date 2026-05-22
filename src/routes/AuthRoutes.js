
// import express from 'express';
// import authController from "../controllers/AuthController.js";
// import {  userMiddleware } from '../middleware/AdminMiddleware.js';

// import {userCheck} from "../middleware/Authmiddleware.js";


// const authroute = express.Router()


// authroute.post('/user',authController.addUser)
// authroute.post('/login',authController.loginUser)
// authroute.get('/logout',authController.logout)

// // authroute.get('/getuser', userMiddleware, allUsers)     // is route pata chal jay ga  user hai yah nahi 
// // authroute.get('/user/:id',userCheck, getUser)  
// // authroute.put('/user/:id ', updateUser)
// // authroute.delete('/user/:id', deleteUser)


// // authroute.getUser('/user', addUser)  

// export default authroute




import express from 'express';
import authController from "../controllers/AuthController.js";
// Naya middleware import kiya jisme adminCheck bhi shamil hai
import { userMiddleware, adminCheck } from '../middleware/AdminMiddleware.js';
import { userCheck } from "../middleware/Authmiddleware.js";

const authroute = express.Router();

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================
authroute.post('/user', authController.addUser);
authroute.post('/login', authController.loginUser);
authroute.get('/logout', authController.logout);

// ==========================================
// 2. PROTECTED ROUTES (For Users & Admins)
// ==========================================
// Normal users aur admin dono is par ja sakte hain
authroute.get('/dashboard/user', userMiddleware, (req, res) => {
    res.json({ 
        status: true, 
        message: "Welcome to User Dashboard", 
        user: req.user 
    });
});

// ==========================================
// 3. STRICTLY ADMIN ROUTES (Only for Admin)
// ==========================================
// Pehle login check hoga (userMiddleware), fir role check hoga (adminCheck)
authroute.get('/dashboard/admin', userMiddleware, adminCheck, (req, res) => {
    res.json({ 
        status: true, 
        message: "Welcome Admin to control backend data!", 
        user: req.user 
    });
});

export default authroute;