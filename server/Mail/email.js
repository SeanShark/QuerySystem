const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: 'qq',
    port: '465',
    secure: false,
    auth: {
        user: '47262243@qq.com',
        pass: process.env.mailPass
    }
})

module.exports = transporter;
