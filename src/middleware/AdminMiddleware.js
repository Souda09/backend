// import jwt from 'jsonwebtoken';
// import Users from '../models/UserSchema.js';

// const userMiddleware = async (req, res, next) => {
//     try {
//         // 1. Token nikalna (Spelling check: authorization)
//         const token = req.headers?.authorization?.split(" ")[1] || req.cookies?.token;

//         if (!token) {
//             return res.json({
//                 status: false,
//                 message: "Token not found, please login again",
//             });
//         }

//         // 2. Token Verify karna
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // 3. User ko DB mein dhoondna (FindUser with capital U fix)
//         const findUser = await Users.findById(decoded.id);

//         if (!findUser) {
//             return res.json({
//                 status: false,
//                 message: "User not valid or does not exist",
//             });
//         }

//         // 4. Role assign karna aur handle karna
//         req.user = findUser; // Pure user ka data req.user mein dal diya

//         // Agar aap chahte hain ke sirf Admin ya User hi aage jayein:
//         if (findUser.role === 'admin' || findUser.role === 'user') {
//             console.log(`Access granted to: ${findUser.role}`);
//             next(); // Agle function (controller) par bhej do
//         } else {
//             return res.json({
//                 status: false,
//                 message: "Access denied: Unknown role",
//             });
//         }

//     } catch (error) {
//         return res.json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

// export { userMiddleware };












import jwt from 'jsonwebtoken';
import Users from '../models/UserSchema.js';

const userMiddleware = async (req, res, next) => {
    try {
        // 1. Token nikalna
        const token = req.headers?.authorization?.split(" ")[1] || req.cookies?.token;

        if (!token) {
            return res.json({
                status: false,
                message: "Token not found, please login again",
            });
        }

        // 2. Token Verify karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. User ko DB mein dhoondna
        const findUser = await Users.findById(decoded.id);

        if (!findUser) {
            return res.json({
                status: false,
                message: "User not valid or does not exist",
            });
        }

        // 4. Pure user ka data req.user mein dal diya
        req.user = findUser; 

        if (findUser.role === 'admin' || findUser.role === 'user') {
            console.log(`Access granted to: ${findUser.role}`);
            next(); // Agle middleware ya controller par bhej do
        } else {
            return res.json({
                status: false,
                message: "Access denied: Unknown role",
            });
        }

    } catch (error) {
        return res.json({
            status: false,
            message: error.message,
        });
    }
};

// 5. Sirf Admin verification ke liye middleware
const adminCheck = (req, res, next) => {
    // userMiddleware pehle chalega, toh req.user pehle se available hoga
    if (req.user && req.user.role === 'admin') {
        next(); // Agar admin hai toh aglay controller par bhej do
    } else {
        return res.status(403).json({
            status: false,
            message: "Access denied: Admins function only"
        });
    }
};

// Dono functions ko ek sath export kar diya
export { userMiddleware, adminCheck };