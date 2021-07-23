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
Graph.prototype.addLegend = function ()
{
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 300,
        height = 100 - margin.top - margin.bottom;

    d3.select("#legend").select("svg").remove();

    this.legendSvg = d3.select("#legend")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var graph = this.getMetadata();

    var variables = graph['variables'];

    offset = 0;

    for (var variableName in variables) 
    {
        var color = graph['variables'][variableName];
        this.legendSvg.append("circle").attr("cx", 20).attr("cy", 0 + offset).attr("r", 6).style("fill", color)
        this.legendSvg.append("text").attr("x", 30).attr("y", 0 + offset).text(variableName).style("font-size", "15px").attr("alignment-baseline", "middle")
        offset += 40;
    }
}