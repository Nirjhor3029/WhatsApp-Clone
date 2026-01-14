const User = require("../models/User");
const { sendOtpToEmail } = require("../services/emailService");
// const { sendOtpToPhone } = require("../services/twilioService");
const twilioService = require("../services/twilioService");
const generateJsonWebToken = require("../utils/generateJsonWebToken");
const generateOTP = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");

// Step-1: send Otp
const sendOtp = async (req, res) => {
    const { phoneNumber, phonePrefix, email } = req.body;

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    try {
        // Send OTP to user with email
        if (email) {
            // return response(res, 400, "Sending OTP via email is currently disabled");
            let user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                user = new User({ email: email.toLowerCase() });
            }
            user.emailOtp = otp;
            user.emailOtpExpiry = expiry;
            await user.save();
            // Send OTP via Email service
            await sendOtpToEmail(email, otp);

            return response(res, 200, "OTP sent to your email successfully", { email });
        }


        // Send OTP to user with phoneNumber
        if (!phoneNumber || !phonePrefix) {
            return response(res, 400, "Phone number and phone prefix are required");
        }

        const fullphoneNumber = `${phonePrefix}${phoneNumber}`; // Concatenate phone prefix and phone number as string
        const user = await User.findOne({ phoneNumber: phoneNumber });
        if (!user) {
            user = new User({ phoneNumber: phoneNumber, phonePrefix: phonePrefix });
        }
        // user.phoneOtp = otp;
        // user.phoneOtpExpiry = expiry;
        await user.save();
        // Send OTP via Twilio service
        await twilioService.sendOtpToPhone(fullphoneNumber);

        return response(res, 200, "OTP sent to your phone number successfully", { phoneNumber });




    } catch (error) {
        console.error("Error in sendOtp:", error);
        return response(res, 500, "Internal Server Error");
        // return res.status(500).json({ message: "Internal Server Error" });
    }
}





// Step-2: verify Otp
const verifyOtp = async (req, res) => {
    const { phoneNumber, phonePrefix, email, otp } = req.body;

    try {
        let user;

        if (email) {
            // Verify email OTP
            user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return response(res, 400, "User with this email does not exist");
            }
            const isOtpMissing = !user.emailOtp;
            const isOtpInvalid = user.emailOtp !== otp;
            const isOtpExpired = user.emailOtpExpiry < new Date();
            if (isOtpMissing || isOtpInvalid || isOtpExpired) {
                return response(res, 400, "Invalid or expired OTP for email");
            } 

            user.isVerified = true;
            user.emailOtp = null;
            user.emailOtpExpiry = null;
            await user.save();
            // return response(res, 200, "Email OTP verified successfully");
        }else{
            // Verify phone OTP
            if(!phoneNumber || !phonePrefix){
                return response(res, 400, "Phone number and phone prefix are required");
            }
            const fullphoneNumber = `${phonePrefix}${phoneNumber}`; // Concatenate phone prefix and phone number as string
            user = await User.findOne({ phoneNumber: phoneNumber });
            if (!user) {
                return response(res, 400, "User with this phone number does not exist");
            }
            const result = await twilioService.verifyOtpFromPhone(fullphoneNumber, otp);
            if(result.status !== "approved"){
                return response(res, 400, "Invalid or expired OTP");
            }
            user.isVerified = true;
            // user.phoneOtp = null;
            // user.phoneOtpExpiry = null;
            await user.save();
            // return response(res, 200, "Phone OTP verified successfully");
        }

        const token = generateJsonWebToken({ user_id: user?._id });

        res.cookie("auth_token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie || XSS attack থেকে safe || Browser শুধু HTTP request-এর সাথে পাঠাবে
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
            // secure: true, // Ensures the cookie is only sent over HTTPS
            // sameSite: "strict", // Adjust based on your requirements (e.g., 'none', 'lax', 'strict')
        });

        return response(res, 200, "OTP verified successfully", { token, user });

    } catch (error) {
        console.log("Error in verifyOtp:", error);
        return response(res, 500, "Internal Server Error");
    }

}

module.exports = { sendOtp, verifyOtp };
