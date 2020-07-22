import Joi from 'joi'
import {v4} from 'uuid'
import path from 'path'
import {NotFound, DataError, EmptyBody} from '../helpers/error.constructor'
import {createControllerProxy} from '../helpers/controller.Proxy'
import fs from 'fs'
const {promises: fsPromises} = fs


class ContactController {
    
    contactsPath = path.join(__dirname, '../data/contacts.json')

    async _readData()  {
        try {
            const data = await fsPromises.readFile(this.contactsPath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            throw new DataError("Read or write Error")
        }
    }
    
    async _writeData(dataArr) {
        const data = JSON.stringify(dataArr)
        try {
            await fsPromises.writeFile(this.contactsPath, data)
        } catch (error) {
            throw new DataError("Read or write Error")
        }
    }
    
    async _getContactIndexAndArrFromData(id) {
        const arrContacts = await this._readData()
        const contactIndex = arrContacts.findIndex(item => item.id === id)
        
        if(contactIndex === -1) {
            throw new NotFound("Contact not found")
        }

        return {    foundContact: arrContacts[contactIndex],
                    contactIndex,
                    arrContacts}
    }
    
    _objIsEmpty(obj) {
       const res = JSON.stringify(obj) === "{}" 
                    ? true
                    : false
        return res
    }

    validateCreateContact(req, res, next) {
        const contactRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required()
        })
        const validationResult = Joi.validate(req.body, contactRules);
        if (validationResult.error) {
            return res.status(400).json(validationResult.error.name);
        }
        next()
    }

    validateUpdateContact(req, res, next) {
        const contactRules = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string()
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
          const arrContacts = await this._readData()
          res.status(200).json(arrContacts)   
        } catch (error) {
            next(error)
        }
    }

    async addContact(req, res, next) { 
        try {       
            const arrContacts = await this._readData()
            const id = v4()
            const { name, email, phone } = req.body
            const newContact = {
                id, name, email, phone
            }
            arrContacts.push(newContact)
            await this._writeData(arrContacts)
            res.status(201).json(newContact)
        } catch (error) {
            next(error)    
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params 
            const { foundContact } = await this._getContactIndexAndArrFromData(id)
            res.status(200).json(foundContact)
        } catch (error) {
            next(error)            
        }
    }

    async removeContact(req, res, next) {
        try {
            const {id} = req.params      
            const {
                    foundContact, 
                    contactIndex, 
                    arrContacts
            } = await this._getContactIndexAndArrFromData(id)
            arrContacts.splice(contactIndex, 1)
            await this._writeData(arrContacts)
            res.status(200).json(foundContact)
        } catch (error) {
            next(error)
        }
    }

    async updateContact(req, res, next) {
        try {
            const { id } = req.params
            const {
                foundContact, 
                contactIndex,
                arrContacts
            } = await this._getContactIndexAndArrFromData(id)
            const newContact = {
                ...foundContact,
                ...req.body
            }
            arrContacts[contactIndex] = newContact
            await this._writeData(arrContacts)
            return res.status(200).json(newContact)
        } catch (error) {
            next(error)
        }
    }

}

export const contactController = createControllerProxy(new ContactController())