const port = 3000;

var path = require('path');
var express = require("express");
var app = express();


var config = undefined;

var htmlPath = path.join(__dirname, 'html');

app.use(express.static(htmlPath));

app.listen(port, () =>
{
    console.log("Server running on port " + port);

    app.get("/config", (req, res, next) =>
    {
        res.send("hello get config.");

    });


    app.put("/config", (req, res, next) =>
    {
        console.log(req);
        res.send("hello post config.");
    });

});