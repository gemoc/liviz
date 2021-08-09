const port = 3000;

var path = require('path');
var express = require("express");
var app = express();

var htmlPath = path.join(__dirname, 'html');

app.use(express.static(htmlPath));

app.listen(port, () =>
{
    console.log("Server running on port " + port);

    app.get("/url", (req, res, next) =>
    {
        res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
    });

});