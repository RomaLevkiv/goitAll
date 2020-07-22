import {Router} from 'express'
import {authController} from './auth.controller'
const router = Router()

router.post('/register', authController.validateRegisterContact, 
                        authController.registerContact)

router.patch('/signin', authController.validateSignIn,
                        authController.signIn)

router.patch('/signout', authController.authorize, 
                        authController.signOut)


export const authRouter = router