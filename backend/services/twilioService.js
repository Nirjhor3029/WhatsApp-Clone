const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

//send otp to phone number

const sendOtpToPhone = async (phoneNumber) => {
    try{
        if(!phoneNumber){
            throw new Error("Phone number is required to send OTP");
        }
        console.log(`Sending otp to this number: ${phoneNumber}`); 
        
        const verificationResponse = await client.verify.v2.services(serviceSid).verifications.create({
            to: phoneNumber,
            channel: 'sms'
        });

        console.log("This is my Twilio Otp response",verificationResponse);
        return verificationResponse;
    }catch(err){
        // return err;
        console.error(err);
        throw new Error("Failed to send OTP via Twilio");
        
    }
}

const verifyOtpFromPhone = async (phoneNumber, code) => {
    console.log(`This is my phone number: ${phoneNumber}`);
    console.log(`This is my OTP: ${code}`);
    
    try{
        if(!phoneNumber || !code){
            throw new Error("Phone number and code are required to verify OTP");
        }
        const verificationCheckResponse = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to: phoneNumber,
            code: code
        });

        console.log("This is my Twilio verify Otp response",verificationCheckResponse);
        return verificationCheckResponse;
    }catch(err){
        console.error(err);
        throw new Error("Failed to verify OTP via Twilio");
    }
}

module.exports = { sendOtpToPhone, verifyOtpFromPhone };