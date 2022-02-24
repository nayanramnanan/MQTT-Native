//Modules
import express from 'express'
import cluster from 'cluster'
import { cpus } from 'os'
import forge from './modules/forge.js'

//Clustering
const numCPUs = cpus().length
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    //Restart worker if crashes
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
    })
} else {
    //Express
    const app = express()
    app.set('view engine', 'ejs')
    app.set('etag', 'strong')

    //Define Port
    const port = process.env.PORT || 3000

    //Start Server
    const server = app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })

    //Middleware - body parser to set req.body
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    //Middleware - serve static File
    app.use(express.static('public'))

    //Middleware - Forge APIs
    app.use('/forge', forge)

    //ROUTING
    app.get('/', (req, res) => {
        res.render('pages/main', { page: 'main' })
    })
}
