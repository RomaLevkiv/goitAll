import express from 'express'
import {contactRouter} from '../route/contact.route'
import mongoose from 'mongoose'
import morgan from 'morgan'
const PORT  = 3000

export class CrudServer {
    constructor() {
        this.server = null
    }

    async start() {
        this.initServer()
        this.initMiddleware()
        this.initRoutes()
        await this.initDatabase()
        this.startListening()
    }

    initServer() {
        this.server = express()
    }

    initMiddleware() {
        this.server.use(express.json())
        this.server.use(morgan('dev'))
    }

    initRoutes() {
        this.server.use('/api/contacts', contactRouter)
    }

    async initDatabase() {
        try {
            await mongoose.connect(process.env.MongoDB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
        } catch (error) {
            console.log("Mongo_DB connect failed", error)          
        }
    }

    startListening() {
        this.server.listen(PORT, () => {
            console.log('server start on port', PORT);
            
        })
    }
}

// export {CrudServer}