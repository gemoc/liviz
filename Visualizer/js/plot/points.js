
var Points = function (name, indice)
{
    Graph.apply(this, arguments);
};

Points.prototype = Object.create(Graph.prototype);
Points.prototype.constructor = Points;


Points.prototype.initialize = function ()
{
    const margin = { top: 50, right: 30, bottom: 30, left: 60 },
        width = document.getElementById("container").offsetWidth * 0.95 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var [xMin, xMax, yMin, yMax] = Settings.getAxisBounds();

    // append the svg object to the body of the page
    this.svg = d3.select("#container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    this.x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, width]);

    this.xAxis = this.svg.append("g")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(d3.axisBottom(this.x));

    // Add Y axis
    this.y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    this.yAxis = this.svg.append("g")
        .attr("transform", "translate(-5,0)")
        .call(d3.axisLeft(this.y));


    this.addLegend();
    this.addToolTip(margin, width);

    this.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

}
Points.prototype.redraw = function ()
{
    this.svg.selectAll("circle").remove();

    var meta = this.getMetadata();

    var variables = meta['variables'];

    var x = this.x;
    var y = this.y;

    for (var variableName in variables) 
    {
        data = this.data.get(variableName);

        var color = meta["variables"][variableName];

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

Points.prototype.append = function (variableName, obj)
{
    var meta = this.getMetadata();
    var color = meta['variables'][variableName];
    var data = []

    data.push(obj);

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


Points.prototype.addToolTip = function (margin, width)
{
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("x", width - 300)
        .attr("y", 0)
        .style("opacity", 0);


    var svg = this.svg;







    d3.select("#container").on("mousemove", function ()
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

        circleSet.on("mouseover", function (obj, indice, it)
        {
            console.log(obj);

            div.style("opacity", .9);
            div.style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 60) + "px")
                .html("<b>x : </b>" + obj.date + "<br>"
                    + "<b>y : </b>" + obj.close + "<br>"
                    + "<b>indice : </b>" + indice + "<br>");


        }).on("mouseout", function ()
        {
            var mouse_x = d3.mouse(this)[0];
            var mouse_y = d3.mouse(this)[1];

            // Si la position de la souris est en dehors de la zone du graphique, on masque la ligne et le tooltip
            if (mouse_x < margin.left || mouse_x > (width + margin.left) || mouse_y < margin.top || mouse_y > (400 - margin.bottom))
            {
                div.style("opacity", 0);

            }
        })




    });
}

