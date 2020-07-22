import Joi from 'joi'
import {NotFound, EmptyBody} from '../helpers/error.constructor'
import {createControllerProxy} from '../helpers/controller.Proxy'
import { contactModel } from '../model/contact.model'


class ContactController {
    
    
    _objIsEmpty(obj) {
        const res = JSON.stringify(obj) === "{}" 
                     ? true
                     : false
         return res
     }

    _checkNull(obj) {
       if(!obj){
            throw new NotFound("Contact not found")
       }
    }

    validateCreateContact(req, res, next) {
        const contactRules = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
            })
        const validationResult = Joi.validate(req.body, contactRules);
        if (validationResult.error) {
            return res.status(400).json(validationResult.error.name);
        }
        next()
    }

    validateUpdateContact(req, res, next) {
        const contactRules = Joi.object({
            email: Joi.string()
        })
        const validationResult = Joi.validate(req.body, contactRules)
        if (validationResult.error) {      
            return res.status(400).json(validationResult.error.name)
        }
        if(this._objIsEmpty(req.body)){
            next(new EmptyBody("Body can't be empty"))
        }
        next()
    }


    async listContacts(req, res, next) {
        try {
          const arrContacts = await contactModel.getAllContacts()
          res.status(200).json(arrContacts)   
        } catch (error) {
            next(error)
        }
    }

    async addContact(req, res, next) { 
        try {       
            const newContact = {...req.body}
            await contactModel.addContact(newContact)
            res.status(201).json(newContact)
        } catch (error) {
            next(error)    
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params 
            const  foundContact  = await contactModel.getById(id)
            this._checkNull(foundContact)
            res.status(200).json(foundContact)
        } catch (error) {
            next(error)            
        }
    }

    async removeContact(req, res, next) {
        try {
            const {id} = req.params      
            const del = await contactModel.removeContact(id)
            this._checkNull(del)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    async updateContact(req, res, next) {
        try {
            const { id } = req.params
            const updContact = await contactModel.updateContact(id, req.body)
            this._checkNull(updContact)
            return res.status(200).json(updContact)
        } catch (error) {
            next(error)
        }
    }

    async getCurrentContact (req, res, next) {
        try {
            console.log(req.contact)
            
            const composeContact = {
                email: req.contact.email,
                subscription: req.contact.subscription
            }
            res.status(200).json(composeContact)
        } catch (error) {
            next (error)
        }
    }
}

export const contactController = createControllerProxy(new ContactController())