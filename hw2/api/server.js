import express from 'express'
import {contactRouter} from '../route/contact.route'
import morgan from 'morgan'
const PORT  = 3000

export class CrudServer {
    constructor() {
        this.server = null
    }

    start() {
        this.initServer()
        this.initMiddleware()
        this.initRoutes()
        // this.initDatabase()
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

    initDatabase() {

    }

    startListening() {
        this.server.listen(PORT, () => {
            console.log('server start on port', PORT);
            
        })
    }
}

// export {CrudServer}