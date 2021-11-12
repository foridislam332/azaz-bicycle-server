const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

// PORT
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connect appliction
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyyp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Database connect')

        const database = client.db('bikesStore');
        const bikeCollection = database.collection('bikes')
        const orderCollection = database.collection('orders')

        app.get('/bikes', async (req, res) => {
            const cursor = bikeCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        // find by bikeId
        app.get('/bikes/:bikeId', async (req, res) => {
            const bikeId = req.params.bikeId;
            const query = { _id: ObjectId(bikeId) }
            const result = await bikeCollection.findOne(query);
            res.json(result)
        })

        // POST API
        app.post('/userOrder', async (req, res) => {
            const addOrder = req.body;
            const result = await orderCollection.insertOne(addOrder)
            res.json(result)
        })

        // Find My Orders
        app.get('/userOrder', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })

        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
            console.log(result)
        })

        // Delete Order
        app.delete('/order/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)
            console.log(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// App get
app.get('/', (req, res) => {
    res.send('A.zaz Bicycle Running');
})

// Listen PORT
app.listen(port, (req, res) => {
    console.log('Listenning port is:', port);
})