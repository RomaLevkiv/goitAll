import Joi from 'joi'
import {NotFound, EmptyBody, ConflictError, ConflictSubscriptionField, UnauthorizedError} from '../helpers/error.constructor'
import {createControllerProxy} from '../helpers/controller.Proxy'
import { contactModel } from '../model/contact.model'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthController {
//constants    
    _saltRounds = 7

//middleware

    validateRegisterContact(req, res, next) { 
        const contactRules = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            subscription: Joi.string()
        })

        const validationResults = Joi.validate(req.body, contactRules)
        if(validationResults.error) {
            res.status(400).json(validationResults.error)
        }
        const {subscription} = req.body
        
        if( !(subscription === "free" 
            || subscription === "pro"
            || subscription === "premium"
            || subscription === undefined)) {
                throw new ConflictSubscriptionField("Field subscription not valid")
        }
        next()
    }

    
    validateSignIn(req, res, next) {
        const contactRules = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })

        const validationResults = Joi.validate(req.body, contactRules)
        if(validationResults.error) {
            res.status(400).json(validationResults.error)
        }
        next()
    }

    async authorize (req, res, next) {
        // 1. get token from header
      // 2. verify jwt token
      // 3. find user by token
      // 4. invoke next middleware
        try {
            
            //1
            const authHeader = req.headers.authorization || ""
            const token = authHeader.replace("Bearer ", "")
            
            //2
            
            try {
                jwt.verify(token, process.env.SECRET_JWT)
            } catch (error) {
                throw new UnauthorizedError("Token is not valid") 
            }
            //3
            const contact = await contactModel.findContactByToken(token)
            if(!contact) {
                throw new UnauthorizedError("Contact not found")    
            }
            req.contact = {
                _id: contact._id,
                email: contact.email,
                subscription: contact.subscription
            }
            req.token = token 
            
            //4
            next()

        } catch (error) {
            next(error)    
        }
            
        

    }


// finish controllers

    async signOut(req, res, next) {
        try {
            const updContact = await contactModel.updateContact(req.contact._id, {token: ""})
            console.log(updContact);
            res.status(204).json()
        } catch (error) {
            next(error)
        }
    }

    async signIn(req, res, next) {
        try {
          // 1. validate request body +
          // 2. fetch user by email from DB +
          // 3. check passwords hash +
          // 4. create session token +
          // 5. send successful response +
          
            const {email, password} = req.body
        //2
            const existContact = await contactModel.findContactByEmail(email)
            if(!existContact) {
                throw new UnauthorizedError("Contact has not existed")
            }
            
        //3
            const passwordHashDb = existContact.password
            const checkResult = await bcryptjs.compare(password, passwordHashDb)
            if(!checkResult) {
                throw new UnauthorizedError("Password is not valid")
            }
            
        //4 
            const {_id} = existContact
            const token = jwt.sign({_id}, process.env.SECRET_JWT)
            const updContact = await contactModel.updateContact(_id, {token})           
        //5
            const contactInfo = {
                token: updContact.token,
                contact: {
                    email: updContact.email,
                    subscription: updContact.subscription
                }
            }
            res.status(200).json(contactInfo)

        } catch(error) {
            next(error)
        }
    }

    async registerContact(req, res, next) {
        // 1. validate request body +
      // 2. check if email exists in collection 
      // 3. hash password 
      // 4. save user to DB 
      // 5. send response 
        try {
            
            const {email, password, subscription
                , avatarURL
            } = req.body
            const existContact = await contactModel.findContactByEmail(email)
            if(existContact) {
                throw new ConflictError('Such contast is exist')
            }
            const passwordHash = await bcryptjs.hash(password, this._saltRounds)
            
            const newContact = {
                email, 
                password: passwordHash, 
                subscription,
                token: "",
                avatarURL
            }            
            const contactCreated = await contactModel.addContact(newContact)
            
            
            res.status(201).json(contactCreated)
        } catch (error) {
            next(error)   
        }        
    }

    
}

export const authController = createControllerProxy(new AuthController())