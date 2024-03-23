import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    host:process.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },

})
export default transporter