require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('622f5707aaba7fb95da40d4d').then(() => Task.countDocuments({completed: true})).then(count => console.log(count)).catch(e => console.log(e))
