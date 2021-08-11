
/* The API port */
const port = 3000;

var path = require('path');
var express = require("express");
var bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');


var app = express();
var jsonParser = bodyParser.json()
var htmlPath = path.join(__dirname, 'html');


/* The current config */
var config = null;
/* Mapping between graph name and rabbitMQ queues */
var graphMapping = new Map();

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

    app.put('/data', jsonParser, function (req, res)
    {
        config = req.body;
        mapQueues();
        res.sendStatus(201); // Created
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
        console.log(graph.name + " : " + uid);
    }
}