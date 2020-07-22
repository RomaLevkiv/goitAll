import mongoose, {Schema} from 'mongoose'
const { ObjectId } = mongoose.Types

export const subscriptionValues = {
    FREE: "free",
    PRO: "pro",
    PREMIUM: "premium"
}

export const statusValues = {
    ACTIVE: "active",
    NOT_VERIFY: "notVeryfy"
}

const contactSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type:String, 
        required: true
    },
    avatarURL: {
        type: String, 
        required: true
    },
    subscription: {
        type: String,
        enum: [
            subscriptionValues.FREE,
            subscriptionValues.PRO,
            subscriptionValues.PREMIUM
        ],
        default: subscriptionValues.FREE
    },
    tokenVerify: { type: String },
    status: {
        type: String,
        enum: [
            statusValues.ACTIVE,
            statusValues.NOT_VERIFY
        ],
        required: true

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
contactSchema.statics.updateContactByVerificationToken = updateContactByVerificationToken

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

async function updateContactByVerificationToken (tokenVerify) {
    return this.findOneAndUpdate({tokenVerify}, {
        tokenVerify: null,
        status: statusValues.ACTIVE
    },
        {new: true}
    )
}

export const contactModel = mongoose.model("Contact", contactSchema)

// contactModel.findOneAndUpdate