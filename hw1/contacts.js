const fs = require('fs')
const path = require('path')

const contactsPath = path.join(__dirname, '/db/contacts.json')

function _listContacts() {
    return new Promise((resolve, reject) => {
        fs.readFile(contactsPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }
            const jsonData = JSON.parse(data)
            resolve(jsonData)
        })
    })
}

async function listContacts() {
    try {
        const data = await _listContacts()
        console.log(data)
    } catch (error) {
        console.log(error);
        throw error
    }
}


async function getContactById(contactId) {
    try {
        const data = await _listContacts()
        const elemById = data.filter((item) => item.id === contactId)
        console.log(elemById)
        return elemById
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function removeContactById(contactId) {
    try {
        const data = await _listContacts()
        const newListJson = data.filter(item => item.id !== contactId)
        if (data.length === newListJson.length) {
            console.log({ "message": "ELEMENT NOT FOUND!" })
            return { "message": "ELEMENT NOT FOUND!" }
        }
        const textList = JSON.stringify(newListJson)

        await fs.writeFile(contactsPath, textList, (err) => {
            if (err) {
                throw err
            }
        })
        console.log({ "message": "ELEMENT WAS DELETED!" })
        return { "message": "ELEMENT WAS DELETED!" }
    } catch (error) {
        console.log(error);
        throw error
    }


}

async function addContact(name, email, phone) {
    try {

        if (!name || !email || !phone) {
            console.log({ "message": "Input valid info" })
            return { "message": "Input valid info" }
        }

        const newData = {
            id: +new Date(),
            name,
            email,
            phone
        }

        const data = await _listContacts()
        data.push(newData)
        const textData = JSON.stringify(data)
        await fs.writeFile(contactsPath, textData, (err) => {
            if (err) {
                throw err
            }
        })
        console.log({ "message": "contact was added!" })
        return { "message": "contact was added!" }

    } catch (error) {
        throw error
    }
}

module.exports = { listContacts, getContactById, removeContactById, addContact }
