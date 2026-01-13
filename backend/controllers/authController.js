const User = require("../models/User");
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
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                user = new User({ email: email.toLowerCase() });
            }
            user.emailOtp = otp;
            user.emailOtpExpiry = expiry;
            await user.save();
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
        return response(res, 200, "OTP sent to your phone number successfully", { phoneNumber });




    } catch (error) {
        console.error("Error in sendOtp:", error);
        return response(res, 500, "Internal Server Error");
        // return res.status(500).json({ message: "Internal Server Error" });
    }
}