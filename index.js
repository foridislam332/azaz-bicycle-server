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
        const userCollection = database.collection('users')
        const reviewCollection = database.collection('reviews')
        const newsCollection = database.collection('news')

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

        // POST New Bike
        app.post('/bikes', async (req, res) => {
            const addNewBike = req.body;
            const result = await bikeCollection.insertOne(addNewBike)
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
        })

        // Delete Order
        app.delete('/order/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

        // POST User
        app.post('/users', async (req, res) => {
            const addUser = req.body;
            const result = await userCollection.insertOne(addUser);
            res.json(result);
        })

        // Find Admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        // PUT User
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        // PUT Role
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        // POST Reviews
        app.post('/reviews', async (req, res) => {
            const uesrReview = req.body;
            const result = await reviewCollection.insertOne(uesrReview);
            res.json(result);
        })

        // Find Review
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        // Find News
        app.get('/news', async (req, res) => {
            const cursor = newsCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
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