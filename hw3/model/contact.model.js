import mongoose, {Schema} from 'mongoose'
const { ObjectId } = mongoose.Types

const contactSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    subscription: {type: String},
    password: {type:String},
    token: {type: String}
})

contactSchema.statics.getAllContacts = getAllContacts
contactSchema.statics.addContact = addContact
contactSchema.statics.getById = getById
contactSchema.statics.removeContact = removeContact
contactSchema.statics.updateContact = updateContact

async function getAllContacts() {
    return await this.find()    
}

async function addContact(newContact) {
    return this.create(newContact)
}

async function getById(id) {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return this.findById(id)
}

async function removeContact(id) {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return this.findByIdAndDelete(id)
}

async function updateContact(id, contactParams) {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return this.findByIdAndUpdate(id, {$set: contactParams}, {new: true})
}

export const contactModel = mongoose.model("Contact", contactSchema)
// contactModel.findByIdAndUpdate