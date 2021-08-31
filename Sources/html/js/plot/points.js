
var Points = function (name, indice)
{
    Graph.apply(this, arguments);
};

Points.prototype = Object.create(Graph.prototype);
Points.prototype.constructor = Points;

/**
 * Create the svg object, create axis
 * add legend and tooltip. 
 * All the dynamic parameters of the graph must be created here 
 */
Points.prototype.initialize = function ()
{
    Graph.prototype.initialize.call(this);
    
    var meta = this.getMetadata();

    var [xMin, xMax, yMin, yMax] = meta['bounds'];

    // append the svg object to the body of the page
    this.svg = this.parent
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, this.width]);

    this.xAxis = this.svg.append("g")
        .attr("transform", "translate(0," + (this.height + 5) + ")")
        .call(d3.axisBottom(this.x));

    // Add Y axis
    this.y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([this.height, 0]);

    this.yAxis = this.svg.append("g")
        .attr("transform", "translate(-5,0)")
        .call(d3.axisLeft(this.y));


    this.addLegend();

    this.addToolTip();

    /*
    The path clip is used to prevent data from 
    being drawn outside the canvas container 
    */
    this.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", this.width)
        .attr("height", this.height);

}
/*
Remove and redraw the svg. This function
is used when modifiying axis.
*/
Points.prototype.redraw = function ()
{
    this.svg.selectAll("circle").remove();

    var meta = this.getMetadata();

    var variables = meta['variables'];
	var colors = meta['colors'];

    var x = this.x;
    var y = this.y;

    for (const variableName of variables)
    {
        data = this.data.get(variableName);

        var color = colors[variableName];

        this.svg.selectAll("points")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", color)
            .attr("stroke", "none")
            .attr("cx", function (d) { return x(d.date) })
            .attr("clip-path", "url(#clip)")
            .attr("cy", function (d) { return y(d.close) })
            .attr("r", 3);

    }


}

Points.prototype.append = function (variableName, data)
{
    var meta = this.getMetadata();
    var colors = meta['colors'];
	
	var color = colors[variableName];

    var x = this.x;
    var y = this.y;

    // Add the line
    this.svg.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", color)
        .attr("stroke", "none")
        .attr("cx", function (d) { return x(d.date) })
        .attr("cy", function (d) { return y(d.close) })
        .attr("clip-path", "url(#clip)")
        .attr("r", 3)
}

Points.prototype.addToolTip = function ()
{
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("x", this.width - 300)
        .attr("y", 0)
        .style("opacity", 0);


    var svg = this.svg;

    var margin = this.margin;

    var width = this.width;

    this.parent.on("mousemove", function ()
    {
        // Récupération de la position X & Y de la souris.
        var mouse_x = d3.mouse(this)[0];
        var mouse_y = d3.mouse(this)[1];

        // Si la position de la souris est en dehors de la zone du graphique, on arrête le traitement
        if (mouse_x < margin.left || mouse_x > (width + margin.left) || mouse_y < margin.top || mouse_y > (400 - margin.bottom))
        {
            return;
        }

        var circleSet = svg.selectAll("circle");

        circleSet.on("mouseover", function (obj, indice)
        {
            div.style("opacity", .9);
            div.style("display", "block");
            
            div.style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 60) + "px")
                .html("<b>x : </b>" + obj.date + "<br>"
                    + "<b>y : </b>" + obj.close + "<br>"
                    + "<b>indice : </b>" + indice + "<br>");


        }).on("mouseout", function ()
        {
            div.style("display", "none");
        })
    });
}

