var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var bodyParser = require('body-parser'); 

var app = Express();
app.use(cors());
app.use(bodyParser.json());
var CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.bzt2ooy.mongodb.net/";
var DATABASE = "pruebatecnicadb";
var database;

app.listen(5038, () => {
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (error, client) => {
        if (error) throw error;
        database = client.db(DATABASE);
        console.log("Connection successful");
    });
});

app.get('/api/pruebatecnicadb/getorders', (request, response) => {
    database.collection("orders").find({}).toArray((error, result) => {
        if (error) response.status(500).send("Error fetching orders");
        else response.send(result);
    });
});

app.post('/api/pruebatecnicadb/addorder', (request, response) => {
    const newOrder = request.body;
    database.collection("orders").insertOne(newOrder, (error, result) => {
        if (error) response.status(500).send("Error adding order");
        else response.json("Order added successfully");
    });
});

app.delete('/api/pruebatecnicadb/deleteorder/:id', (request, response) => {
    const orderId = request.params.id;
    database.collection("orders").deleteOne({ id: orderId }, (error, result) => {
        if (error) response.status(500).send("Error deleting order");
        else if (result.deletedCount === 0) response.status(404).send("Order not found");
        else response.json("Order deleted successfully");
    });
});

app.put('/api/pruebatecnicadb/editorder/:id', (request, response) => {
    const orderId = request.params.id;
    const updatedData = request.body;
    database.collection("orders").updateOne({ id: orderId }, { $set: updatedData }, (error, result) => {
        if (error) response.status(500).send("Error updating order");
        else response.json("Order updated successfully");
    });
});

app.get('/api/pruebatecnicadb/getproducts', (request, response) => {
    database.collection("products").find({}).toArray((error, result) => {
        if (error) response.status(500).send("Error fetching products");
        else response.send(result);
    });
});

app.use(express.static('./ordersapp'));
app.get('*', (req, res) => {
  res.sendFile('index.html', {root: 'dist/ordersapp'});
});


app.get('/api/pruebatecnicadb/getorder/:id', (request, response) => {
    const orderId = request.params.id;
    database.collection("orders").findOne({ id: orderId }, (error, result) => {
        if (error) response.status(500).send("Error fetching order");
        else if (!result) response.status(404).send("Order not found");
        else response.send(result);
    });
});
