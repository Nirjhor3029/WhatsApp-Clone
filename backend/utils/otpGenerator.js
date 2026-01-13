//generate a 6-digit OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }



// const generateOTP = (digit = 6) => {
//     let otp = '';
//     for (let i = 0; i < digit; i++) {
//         otp += Math.floor(Math.random() * 10); // Append a random digit (0-9)
//     }
//     return otp;
// }
// console.log(Math.random());
// console.log(generateOTP());




/**
 *  Using crypto.randomInt for cryptographically secure, unpredictable OTP generation
 *  (Math.random is not suitable for security-sensitive use cases cause it's predictable by knowing the algorithm and seed value)
 */

const crypto = require('crypto');

const generateOTP = (digit = 6) => {
    let otp = '';
    for (let i = 0; i < digit; i++) {
        otp += crypto.randomInt(0, 10);
    }
    return otp;
};

// console.log(crypto.randomInt(0, 10));
// console.log(generateOTP()); // Default 6-digit OTP
// console.log(generateOTP(4));
// console.log(generateOTP(8));




module.exports = generateOTP;

