
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

var onConnect = function (error, connection)
{
    if (error != null)
    {
        console.log(error);
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

amqp.connect('amqp://localhost', onConnect);

/* Members decarations */
var config = null;
var graphMapping = new Map();

var app = express();
var jsonParser = bodyParser.json()
var htmlPath = path.join(__dirname, 'html');


app.use(bodyParser.urlencoded({ extended: true }));
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

    app.put('/config', jsonParser, function (req, res)
    {
        config = req.body;

        if (config == null || config == undefined)
        {
            res.sendStatus(400);
            return;
        }

        mapQueues();
        res.sendStatus(201); // Created
    })

    app.get("/graph/:name", (req, res) =>
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

    app.put('/graph', function (req, res)
    {
        var graphName = req.body.graphName;

        console.log(graphName);

        if (!graphMapping.has(graphName))
        {
            res.sendStatus(404);
            return;
        }

        var data = req.body.data;

        var graphUUID = graphMapping.get(graphName);

        amqpChannel.sendToQueue(graphUUID, Buffer.from(data));

        res.sendStatus(200); // Ok

        console.log("Send " + graphUUID);
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