import dns from 'dns'

dns.setServers(["8.8.8.8", "1.1.1.1"])
import express from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import Users from './models/UserSchema.js';
import authroute from './routes/AuthRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express()   //server create kiya 

dotenv.config()   // package call



connectdb()

console.log(process.env.MONGOURI);

               // yah pah ham ne middleware banya ha cookieparser ka 
app.use(express.json());
app.use(cookieParser())
console.log(cookieParser())
app.use(cors({
    
    origin:[ 'http://localhost:5174',
    "https://frontend-rho-rosy-29.vercel.app"],

    credentials: true
}));
// create a get api 
app.get('/', (req, res) => {
    res.json({
        message: " Sucessfully run Souda "
    });

});

// api/v1/auth/
app.use('/api/v1/auth', authroute)   //jo routes hn sb authroutes me hain yahn attach ho gay hn 

app.listen(process.env.Port, () => {
    console.log("Server is runing --->", process.env.Port);

});


//  ------------------------------ OLD METHOD TO WRITE  A API
// app.post("/api/v1/auth/user", async(req,res) =>{

// });

// app.GET("/api/v1/auth/user", async(req,res) =>{

// });

// app.PUT("/api/v1/auth/user", async(req,res) =>{

// });

// app.Delete("/api/v1/auth/user", async(req,res) =>{

//
