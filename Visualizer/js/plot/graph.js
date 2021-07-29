


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

    this.parent = d3.select("#container").append(this.name);

    this.margin = { top: 50, right: 30, bottom: 30, left: 60 },
        this.width = document.getElementById("container").offsetWidth * 0.95 - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;

    this.data = new Map();

};

/**
 @abstract
 */
Graph.prototype.initialize = function ()
{
    throw new Error("Abstract method!");
}

Graph.prototype.onReceive = function (variableName, data)
{
    if (!this.data.has(variableName))
    {
        this.data.set(variableName, []);
    }
    else
    {
        var array = this.data.get(variableName);

        for (const obj of data)
        {
            array.push(obj);

        }
    }
    this.append(variableName, data);
}
/**
 @abstract
 */
Graph.prototype.append = function (variableName, data)
{
    throw new Error("Abstract method!");
}
Graph.prototype.redraw = function ()
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
    this.parent.select("svg").remove();
    this.parent.selectAll("input").remove();
    this.parent.selectAll("label").remove();
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

Graph.prototype.addVariable = function (variableName, color)
{
    var input = this.parent
        .append("input")
        .attr("id", "color-" + variableName)
        .attr("name", "color-" + variableName)
        .attr("type", "color")
        .attr("value", color)

        .on("change", function (d)
        {
            var graph = Plotter.graphs.values().next().value;
            graph.redraw();
        });

    input.style("margin-left", this.margin.left + "px")

    this.parent
        .append("label")
        .attr("for", "color-" + variableName)
        .style("margin-left", "10px")
        .html(variableName)
}
Graph.prototype.addLegend = function ()
{
    const defaultColors = ["#FF0000", "#0000ff", "#008000", "#992277", "#11ffee"];


    var graph = this.getMetadata();

    var variables = graph['variables'];

    i = 0;

    for (const variableName of variables) 
    {
        this.addVariable(variableName, defaultColors[i]);
        i++;
    }
}