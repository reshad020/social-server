const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

//middlewares
app.use(cors()); 
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Language server is running')
})
app.listen(port, ()=>{
    console.log('Server is running',port);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efzfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        //connect and create in mongodb
        client.connect();
        const database = client.db('socialmedia-app');
        const userCollection = database.collection('user');

        //Get users api
        app.get('/users', async(req,res) =>{
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);

        })

        app.get('/users/:email', async(req,res) =>{
            const email = req.params.email;
            const query = {email: email};
            const user = await userCollection.findOne(query);
            res.json(user);
            console.log('hit api')

        })

        app.post('/users', async(req,res) =>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
            console.log('hit api');
    })

    }
    finally{

    }
}


run().catch(console.dir);
