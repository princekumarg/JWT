import express from 'express'
import UserController from '../controllers/userController.js'

import checkUserAuth from '../middlewares/auth-middleware.js'
const router=express.Router()
//middle ware
router.use('/changePassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)

router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-reset-email',UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)
//Protected routes

router.post('/changePassword',UserController.changePassword)
router.get('/loggeduser',UserController.loggedUser)

export default router