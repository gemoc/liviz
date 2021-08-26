
/* Constants */
const port = 3000;
const webSocketUrl = 'ws://localhost:15674/ws';

/* Requires */
var path = require('path');
var express = require("express");
var bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');


var amqp = require('amqplib/callback_api');

amqpChannel = null;

console.log("Starting WebApi...");

var onConnect = async function (error, connection)
{
    if (error != null)
    {
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log("Waiting for stomp module...");
        amqp.connect('amqp://rabbitmq', onConnect);
        return;
    }

    connection.createChannel(function (error1, channel)
    {
        if (error1)
        {
            throw error1;
        }
        amqpChannel = channel;
        console.log("Connected to RabbitMQ");

    });

};



amqp.connect('amqp://rabbitmq', onConnect);


/* Members decarations */
var config = null;
var graphMapping = new Map();

var app = express();
var htmlPath = path.join(__dirname, 'html');


app.use(bodyParser.text({ extended: true }));
app.use(express.static(htmlPath));



app.listen(port, () =>
{
    console.log("Server running on port " + port);

    app.get("/config", (req, res) =>
    {
        if (config != null)
        {
            res.json(config);
        }
        else
        {
            res.sendStatus(404);
        }

    });

    app.put('/config', function (req, res)
    {
        console.log(req.body);

        config = JSON.parse(req.body);
        console.log(config);

        if (config == null || config == undefined)
        {
            res.sendStatus(400);
            return;
        }

        mapQueues();
        res.sendStatus(201); // Created
    })

    app.get("/graphs/:name", (req, res) =>
    {
        var graphName = req.params.name;

        if (graphMapping.has(graphName))
        {
            res.send(graphMapping.get(graphName));
        }
        else
        {
            res.sendStatus(404);
        }

    });

    app.put('/graphs/:graphName', function (req, res)
    {
        var graphName = req.params.graphName;

        if (!graphMapping.has(graphName))
        {
            res.sendStatus(404);
            return;
        }

        var data = req.body;

        console.log(data);

        var graphUUID = graphMapping.get(graphName);

        amqpChannel.sendToQueue(graphUUID, Buffer.from(data));

        res.sendStatus(200); // Ok

    })

});


function mapQueues()
{
    graphMapping = new Map();

    var graphs = config['graphs'];

    for (const graph of graphs) 
    {
        var uid = uuidv4();
        graphMapping.set(graph.name, uid);

        amqpChannel.assertQueue(uid, {
            durable: false
        });

        console.log(graph.name + " mapped to " + uid);
    }

    console.log("Graph(s) mapped.");
}
