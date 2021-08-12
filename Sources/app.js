
/* Constants */
const port = 3000;
const webSocketUrl = 'ws://localhost:15674/ws';


/* Requires */
var path = require('path');
var express = require("express");
var bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
var stomp = require('@stomp/stompjs');
Object.assign(global, { WebSocket: require('websocket').w3cwebsocket });




/* Members decarations */
var config = null;
var graphMapping = new Map();

var app = express();
var jsonParser = bodyParser.json()
var htmlPath = path.join(__dirname, 'html');
const client = new stomp.Client();
client.brokerURL = webSocketUrl;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(htmlPath));


client.onConnect = function (frame)
{
    console.log("Connected to RabbitMQ");
    // Do something, all subscribes must be done is this callback
    // This is needed because this will be executed after a (re)connect
};

client.onStompError = function (frame)
{
    // Will be invoked in case of error encountered at Broker
    // Bad login/passcode typically will cause an error
    // Complaint brokers will set `message` header with a brief message. Body may contain details.
    // Compliant brokers will terminate the connection after any error
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
};

client.activate();

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

    app.get("/graph", (req, res) =>
    {
        var graphName = req.query.name;

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

        client.publish({
            destination: '/amq/queue/' + 'myGrapha',
            body: data,
        });

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

        console.log(graph.name + " mapped to " + uid);
    }

    console.log("Graph(s) mapped.");
}