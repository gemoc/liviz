/**
 @constructor
 */
var PlotData = function (raw)
{
    this.raw = raw;
    this.data = new Map();

    this.parse();

};


PlotData.prototype.parse = function ()
{
    this.valid = false;

    var lines = this.raw.split('\n');

    var definition = lines[0].trimStart();

    if (!definition.startsWith("#"))
    {
        return;
    }

    var variableNames = lines[0].replace("#", "").match(/[^ ]+/g)

    for (const variableName of variableNames)
    {
        this.data.set(variableName, []);
    }



    for (var i = 1; i < lines.length; i++)
    {
        var values = lines[i].match(/[^ ]+/g);

        for (var i = 0; i < values.length; i++)
        {
            var variable = variableNames[i];
            var value = values[i];

            this.data.get(variable).push(value);
        }
    }

    console.log(this.data);

    this.valid = true;
}