import {Router} from 'express'
import {contactController} from '../controller/contact.controller'
const router = Router()


router.get('/', contactController.listContacts)

router.post('/',    contactController.validateCreateContact,
                    contactController.addContact)

router.get('/:id', contactController.getById)

router.delete('/:id', contactController.removeContact)

router.patch('/:id',    contactController.validateUpdateContact,
                        contactController.updateContact)

export const contactRouter = router





// const {Router} = require('express')
// const router = Router()
// const {
//     listContacts, 
//     getById,
//     addContactValid,
//     addContact,
//     removeContact,
//     updateContactValid,
//     updateContact
// } = require('../controller/controller')

// router.get('/contacts', listContacts)

// router.get('/contacts/:contactId', getById)

// router.post('/contacts',addContactValid, addContact)

// router.delete('/contacts/:contactId', removeContact)

// router.patch('/contacts/:contactId', updateContactValid, updateContact)

// module.exports = router
