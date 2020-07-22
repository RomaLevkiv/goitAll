import {Router} from 'express'
import {contactController} from '../controller/contact.controller'
import {authController} from '../auth/auth.controller'
const router = Router()



router.get('/', contactController.listContacts)

router.post('/',    contactController.validateCreateContact,
contactController.addContact)

router.get('/:id', contactController.getById)

router.delete('/:id', contactController.removeContact)

router.patch('/:id',    contactController.validateUpdateContact,
contactController.updateContact)

router.get('/get/current', authController.authorize, 
                        contactController.getCurrentContact)


export const contactRouter = router

