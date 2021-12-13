const {MongoClient, ObjectID, ObjectId} = require('mongodb')


const databaseURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'



MongoClient.connect(databaseURL, {useNewUrlParser: true}).then((client) => {
    const db = client.db(databaseName)

    // db.collection('users').deleteMany({name: 'Goran'}).then((result) => {
    //     console.log(result);
        
    // }).catch((error) => {
    //     console.log(error);
        
    // })

    db.collection('tasks').deleteOne({description: 'Reading'}).then(result => console.log(result)
    ).catch(error => console.log(error))

        
}).catch((error) => {
    console.log('Could not connect with database');
})

