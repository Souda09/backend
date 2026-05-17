//  ham is file ma  nmiddlewares banae gay 
// pehly ham without middleware kam karty  ty ab middleware k sath 
// middleware banane ka matlab bar bar code likhna na pary aik middleware bnae gay us ko bar  bar call kary gay 

import jwt from 'jsonwebtoken';

const userCheck = (req,res,next) =>{
    const {id} = req.params    // yah sy token nekal rahy hn 
    try{
        const token = req.headers?.autherization?.split(" ")[1]  || req.cookies.token;
   if(!token){

    res.json({
    status: false,
    message: "token not found",
    })
   }
   
   const decoded = jwt.verify(token,process.env.JWT_SECRET)
   if(decoded.id == id){   // agr id match ho jay login user ka token jo generate howa ha tou next ko call karo

    next()
   }

   else{
    res.json({
        status: false,
        message: 'invalid token'
    })
   }
 console.log(decoded.id == id)
   }  catch(error){
    res.json({
        status: false,
        message: error.message,
    })
   }
   
    }

    export {userCheck}