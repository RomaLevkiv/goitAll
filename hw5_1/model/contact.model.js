import mongoose, {Schema} from 'mongoose'
const { ObjectId } = mongoose.Types

const contactSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true},
    avatarURL: {type: String, required: true},
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
    },
    token: {type: String}
})

contactSchema.statics.getAllContacts = getAllContacts
contactSchema.statics.addContact = addContact
contactSchema.statics.getById = getById
contactSchema.statics.removeContact = removeContact
contactSchema.statics.updateContact = updateContact
contactSchema.statics.findContactByEmail = findContactByEmail
contactSchema.statics.findContactByToken = findContactByToken

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

async function findContactByEmail(email){
    return this.findOne({email})
}

async function findContactByToken(token) {
    return this.findOne({token})
}

export const contactModel = mongoose.model("Contact", contactSchema)

// contactModel.findOne