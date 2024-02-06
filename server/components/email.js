// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';


const mailTransporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: 'qq',
    port: '465',
    secure: false,
    auth: {
        user: '47262243@qq.com',
        pass: process.env.mailPass
    }
})

export default mailTransporter;
