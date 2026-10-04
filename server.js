const express = require('express')
const routes = require('./routes/productRoutes')

const server = express()
server.use(express.json())

server.use('/products', routes)

server.listen(3000, () => {
    console.log('Server running on port 3000')
})