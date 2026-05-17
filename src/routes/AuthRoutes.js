
import express from 'express';
import authController from "../controllers/AuthController.js";
import {  userMiddleware } from '../middleware/AdminMiddleware.js';

import {userCheck} from "../middleware/Authmiddleware.js";


const authroute = express.Router()


authroute.post('/user',authController.addUser)
authroute.post('/login',authController.loginUser)
authroute.get('/logout',authController.logout)

// authroute.get('/getuser', userMiddleware, allUsers)     // is route pata chal jay ga  user hai yah nahi 
// authroute.get('/user/:id',userCheck, getUser)  
// authroute.put('/user/:id ', updateUser)
// authroute.delete('/user/:id', deleteUser)


// authroute.getUser('/user', addUser)  

export default authroute