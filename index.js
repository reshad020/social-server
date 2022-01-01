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
    res.send('Parcel server is running')
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
        const database = client.db('TheParcelGuy');
        const parcelCollection = database.collection('parcels');

        //Get users api
        app.get('/parcels', async(req,res) =>{
            const cursor = parcelCollection.find({});
            const parcels = await cursor.toArray();
            res.send(parcels);

        })

        app.get('/parcels/:email', async(req,res) =>{
            const email = req.params.email;
            const query = {email: email};
            const parcel = parcelCollection.find(query);
            const myParcel = await parcel.toArray();
            res.json(myParcel);
            console.log('hit api')

        })

        app.post('/parcels', async(req,res) =>{
            const parcel = req.body;
            const result = await parcelCollection.insertOne(parcel);
            console.log(result);
            res.json(result);
            console.log('hit api');
    })

    }
    finally{

    }
}


run().catch(console.dir);
