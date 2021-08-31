


/**
 * This class represent one graph SVG
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
 * Called when the Graph object is created.
 * This method will create the parent html division related to graph
 * and the margin property.
 *
 @abstract 
 */
Graph.prototype.initialize = function ()
{
    this.parent = d3.select("#container").append(this.name);

    this.margin = { top: 50, right: 30, bottom: 30, left: 60 },
        this.width = document.getElementById("container").offsetWidth * 0.95 - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;
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

Graph.prototype.addVariable = function (parentDiv, variableName, color)
{
	parentDiv
		.append("div")
        .attr("id", "color-" + variableName)
        .attr("name", "color-" + variableName)
        .style("height", "20px")
        .style("width", "20px")
        .style("background-color", color)
        .style("display", "inline-block")
        .style("margin-left", "10px");
	
    parentDiv
        .append("label")
        .attr("for", "color-" + variableName)
        .style("margin-left", "10px")
        .html(variableName)
}

Graph.prototype.addLegend = function ()
{
    var meta = this.getMetadata();

    var variables = meta['variables'];

    i = 0;
    
    var parent = this.parent.append("div").style("margin-left", "30px");

    for (const variableName of variables) 
    {
        this.addVariable(parent, variableName, meta['colors'][variableName]);
        i++;
    }
}
