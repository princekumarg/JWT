import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from "../config/emailConfig.js";


const userRegistration=async(req, res)=>{
        const {name,email,password,password_confirmation,exists}=req.body
        const user=await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exit"})
        }else{
            if(name&&email&&password&&password_confirmation&&exists){
                if(password===password_confirmation){
                    try {
                        const salt=await bcrypt.genSalt(10)
                        const hashPassword=await bcrypt.hash(password,salt)
                        const newUser=new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        exists:exists
                    })
                    await newUser.save()
                    const savedUser=await UserModel.findOne({email:email})
                    const token=jwt.sign({userid:savedUser._id},process.env.JWT_SECRET,{expiresIn:'5d'})
                    res.status(201).send({"status":"success","message":"User registered successfully","token":token})
                    } catch (error) {
                        console.log(error)
                        res.send({"status":"failed","message":"Unable to register"})
                    }

                }else{
                    res.send({"status":"failed","message":"Password and confirm Password Not match"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
}
const userLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(email&&password){
            const user=await UserModel.findOne({email:email})
            if(user!=null){
                const isMatch=await bcrypt.compare(password,user.password)
                if((user.email===email)&&isMatch){
                    const token=jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:'5d'})
                    res.send({"status":"success","message":"Login successfully","token":token})
                }else{
                    res.send({"status":"success","message":"Invalid email or password"})
                }
            }
            else{
                res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
        }
        else{
            res.send({ "status": "failed", "message": "All Fields are Required" })
        }
    } catch (error) {
        console.log(error)
        res.send({"status":"failed","message":"Unable to login"})
    }
    
}
const changePassword=async(req,res)=>{
    const {password,password_confirmation}=req.body;
    if(password&&password_confirmation){
        if(password!==password_confirmation){
            res.send({"status":"failed","message":"New Password and cconfirm New Password doesn't match"})
        }else{
            const salt=await bcrypt.genSalt(10);
            const newHashPassword=await bcrypt.hash(password,salt)
            console.log(req.user._id)
            await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}})
            res.send({"status":"success","message":"Password changed successfully"})
        }
    }else{
        res.send({"status":"failed","message":"All Fields are required"})
    }
}
const loggedUser=async(req,res)=>{
    res.send({"user":req.user})
}
const sendUserPasswordResetEmail=async(req,res)=>{
    const {email}=req.body;
    if(email){
        const user=await UserModel.findOne({email:email})
        if(user){
            const secret=user._id+process.env.JWT_SECRET
            const token=jwt.sign({userid:user._id},secret,{expiresIn:'15m'})
            const link=`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            console.log(link)
            //send Email
            let info=await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"Password Reset",
                html:`<a href=${link}>Click Here</a> to Reset Your Password`
            })
            res.send({"status":"success","message":"password Reset Email Sent ... Please Check Your Email","info":info})
        }else{
            res.send({"status":"failed","message":"Email doesn't exists"})
        }
    }else{
        res.send({"status":"failed","message":"Email Field is Required"})
    }
}
const userPasswordReset=async(req,res)=>{
    const {password,password_confirmation}=req.body;
    const {id,token}=req.params
    const user=await UserModel.findById(id)
    const new_secret=user._id+process.env.JWT_SECRET
    try {
        jwt.verify(token,new_secret)
        if(password&&password_confirmation){
            if(password!==password_confirmation){
                res.send({"status":"failed","message":"New Password and Confirm New Password doesn't match"})
            }else{
                const salt=await bcrypt.genSalt(10)
                const newHashPassword=await bcrypt.hash(password,salt)
                await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashPassword}})
                res.send({"status":"sucess","message":"Password reset Successfully"})
            }
        }
        else{
            res.send({"status":"failed","message":"Allfields are Required"})
        }
    } catch (error) {
        console.log(error)
        res.send({"staus":"failed","message":"Invalid Token"})
    }
}

export default {
    userRegistration,
    userLogin,
    changePassword,
    loggedUser,
    sendUserPasswordResetEmail,
    userPasswordReset,
}
