import {Router} from 'express'
import {authController} from './auth.controller'
import {generate_upload} from '../middleware/generateUploadCompress_Avatar'
const router = Router()

router.post('/register', authController.validateRegisterContact,
                        generate_upload.generateAvatar,
                        authController.registerContact)

router.patch('/signin', authController.validateSignIn,
                        authController.signIn)

router.patch('/signout', authController.authorize, 
                        authController.signOut)


export const authRouter = router