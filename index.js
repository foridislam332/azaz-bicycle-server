const express = require('express');
const app = express();

// PORT
const port = process.env.PORT || 5000;

// App get
app.get('/', (req, res) => {
    res.send('A.zaz Bicycle Running');
})

// Listen PORT
app.listen(port, (req, res) => {
    console.log('Listenning port is:', port);
})