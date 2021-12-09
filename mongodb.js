const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const databaseURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(databaseURL, {useNewUrlParser: true}, (error, client) => {
    if (error) return console.log('Could not connect with database');

    const db = client.db(databaseName)

    console.log('Connected to database');
    

    db.collection('users').insertOne({
        name: 'Goran',
        age: 32

    })
    
})

