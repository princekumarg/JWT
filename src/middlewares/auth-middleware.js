import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'


var checkUserAuth=async(req,res,next)=>{
    let token
    const {authorization}=req.headers
    if(authorization&&authorization.startsWith('Bearer')){
        try {
            //Get Token form header
            token=authorization.split(' ')[1]
            console.log(token)
            console.log(authorization)
            const {userid}=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await UserModel.findById(userid).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401).send({"status":"failed","message":"Unauthorized user"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized User,No Token"})
    }
}

export default checkUserAuth