const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// this funcion will return a random 6 digit otp
exports.generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

// this function will returns time in second
exports.caluculateTime = (timestamp) => {
    // Get the current timestamp
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - timestamp;

    return Math.floor(timeDifference/1000);
}

exports.generateAuthToken = (user) => {
    let payload = {
        userId: user._id,
        email: user.email,
    }
    return jwt.sign(payload, process.env.SECRET || "jwtsecretkey", {expiresIn: 24*60*60*1000})
}

exports.sendEmail = async (email, otp) => {
    // create a transporter for sending emails
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alexzander.hamill66@ethereal.email',
            pass: 'nW5aPnPEvrdbhY8AMd'
        }
    });

    // send the OTP to the user's email
    const mailOptions = {
        from:'alexzander.hamill66@ethereal.email',
        to: email,
        subject: 'Your OTP for login',
        text: `Your OTP is: ${otp}`
      };
    return transporter.sendMail(mailOptions);
}