const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');
// dotenv.config();
// console.log(process.env.EMAIL_PORT);

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error with email server configuration:", error);
    } else {
        console.log("Email server is ready to send emails.");
    }
});



// transporter.verify().then(() => {
//     console.log("Email server is ready to take messages");
// }).catch((err) => {
//     console.error("Error with email server configuration:", err);
// });

// Verify email server connection
// const verifyEmailServer = async () => {
//     try {
//         await transporter.verify();
//         console.log('Email server is ready to take messages');
//     } catch (error) {
//         console.error('Error with email server configuration:', error);
//         process.exit(1); // optional: stop app if email is critical
//     }
// };


const sendOtpToEmail = async (toEmail, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #075e54;">ðŸ” WhatsApp Web Verification</h2>
        
        <p>Hi there,</p>
        
        <p>Your one-time password (OTP) to verify your WhatsApp Web account is:</p>
        
        <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
            ${otp}
        </h1>

        <p><strong>This OTP is valid for the next 5 minutes.</strong> Please do not share this code with anyone.</p>

        <p>If you didnâ€™t request this OTP, please ignore this email.</p>

        <p style="margin-top: 20px;">Thanks & Regards,<br/>WhatsApp Web Security Team</p>

        <hr style="margin: 30px 0;" />

        <small style="color: #777;">This is an automated message. Please do not reply.</small>
        </div>
    `;

    await transporter.sendMail({
        from: `"WhatsApp Web" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "WhatsApp Web Verification OTP",
        html,
    });
};



// Send an email using async/await
// (async () => {
//     const info = await transporter.sendMail({
//         from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
//         to: "bar@example.com, baz@example.com",
//         subject: "Hello ✔",
//         text: "Hello world?", // Plain-text version of the message
//         html: "<b>Hello world?</b>", // HTML version of the message
//     });

//     console.log("Message sent:", info.messageId);
// })();

module.exports = {
    sendOtpToEmail,
    // verifyEmailServer,
};