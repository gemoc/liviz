/**
 @constructor
 @abstract
 */
var Graph = function (name, indice)
{
    if (this.constructor === Graph)
    {
        throw new Error("Can't instantiate abstract class!");
    }

    this.name = name;
    this.indice = indice;


    this.data = new Map();

};

/**
 @abstract
 */
Graph.prototype.initialize = function ()
{
    throw new Error("Abstract method!");
}

Graph.prototype.onReceive = function (variableName, obj)
{
    if (!this.data.has(variableName))
    {
        this.data.set(variableName, []);
    }
    else
    {
        var array = this.data.get(variableName);
        array.push(obj);
    }
    this.append(variableName, obj);
}
/**
 @abstract
 */
Graph.prototype.append = function (variableName, obj)
{
    throw new Error("Abstract method!");
}
Graph.prototype.redraw = function (variableName, obj)
{
    throw new Error("Abstract method!");
}

Graph.prototype.rescale = function (xMin, xMax, yMin, yMax)
{
    this.x.domain([xMin, xMax]);
    this.xAxis.transition().duration(1000).call(d3.axisBottom(this.x));

    var x = this.x;
    var y = this.y; 0
    this.y.domain([yMin, yMax])
    this.yAxis.transition().duration(1000).call(d3.axisLeft(this.y))

    this.redraw();
}


Graph.prototype.remove = function ()
{
    d3.select("svg").remove();
    this.data = new Map();
}

Graph.prototype.getMetadata = function ()
{
    return Plotter.config['graphs'][this.indice];
}

Graph.prototype.addSettings = function ()
{
    // todo
}
Graph.prototype.addLegend = function ()
{
    const defaultColors = ["#FF0000", "#0000ff"];

    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 300,
        height = 100 - margin.top - margin.bottom;

    var graph = this.getMetadata();

    var variables = graph['variables'];

    i = 0;


    for (var variableName in variables) 
    {
        var color = graph['variables'][variableName];

        var input = d3.select("#legend")

            .append("input")
            .attr("id", "color-" + variableName)
            .attr("name", "color-" + variableName)
            .attr("type", "color")
            .attr("value", defaultColors[i])

            .on("change", function (d)
            {
                var graph = Plotter.graphs.values().next().value;
                graph.redraw();
            });


        if (i == 0)
        {
            input.style("margin-left", margin.left + "px")
        }
        else
        {
            input.style("margin-left", "10px")
        }

        div = input.select(function () { return this.parentNode; })

        div
            .append("label")
            .attr("for", "color-" + variableName)
            .style("margin-left", "10px")
            .html(variableName)

        i++;
    }
}