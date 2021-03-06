import express from 'express'
import {contactRouter} from '../route/contact.route'
import {authRouter} from '../auth/auth.route'
import path from 'path'
import mongoose from 'mongoose'
import morgan from 'morgan'

const PORT = process.env.PORT || 3000

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
        this.server.use(express.urlencoded())
        this.server.use(express.json())
        this.server.use(morgan('dev'))
        this.server.use('/api', express.static('public'))
    }

    initRoutes() {
        this.server.use('/api/contacts', contactRouter)
        this.server.use('/api/auth', authRouter)
    }

    async initDatabase() {
        try {
            await mongoose.connect(process.env.MongoDB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
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