const express = require('express')
require('./db/mongoose.js')
const routerUser = require('./routers/user')
const routerTask = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(routerUser)
app.use(routerTask)

app.listen(port, () => {
    console.log('server started');   
})


