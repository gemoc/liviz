
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

    // append the svg object to the body of the page
    this.svg = d3.select("#container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    this.x = d3.scaleLinear()
        .range([0, width]);

    this.xAxis = this.svg.append("g")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(d3.axisBottom(this.x));

    // Add Y axis
    this.y = d3.scaleLinear()
        .range([height, 0]);

    this.yAxis = this.svg.append("g")
        .attr("transform", "translate(-5,0)")
        .call(d3.axisLeft(this.y));


    this.addLegend();
    this.addToolTip();

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
        .attr("r", 3)
}





Points.prototype.addToolTip = function ()
{
    const margin = { top: 50, right: 30, bottom: 30, left: 60 },
        width = document.getElementById("container").offsetWidth * 0.95 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("x", width - 300)
        .attr("y", 0)
        .style("opacity", 0);

    var verticalLine = this.svg.append("line")
        .attr("class", "verticalLine")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)
        .style("opacity", 0);


    var x = this.x;
    var y = this.y;
    var data = this.data;

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

        // Grâce à la fonction 'invert' nous récupérons la date correspondant à notre position
        // A noter, il faut soustraire la marge à gauche pour que la valeur soit correct.
        var selected = x.invert(mouse_x - margin.left);

        // Positionnement de la barre verticale toujours en tenant compte de la marge
        verticalLine.attr("x1", mouse_x - margin.left);
        verticalLine.attr("x2", mouse_x - margin.left);
        verticalLine.style("opacity", 1);

        // Le revert est précis à la milliseconde, ce qui n'est pas le cas de nos données

        var entry = data.get("var2");

        if (typeof entry === "undefined")
        {
            return;
        }
        // Si une entrée existe pour la date sélectionnée nous pouvons afficher les données.

        // Le comportement est équivalent aux précédents exemples pour le tooltip.
        div.style("opacity", .9);
        div.style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 60) + "px")
            .html("<b>x : </b>" + selected + "<br>"
                + "<b>maVariable : </b>Work in progress<br>"
                + "<b>var2 : </b>Work in progress<br>");
    }).on("mouseout", function ()
    {
        var mouse_x = d3.mouse(this)[0];
        var mouse_y = d3.mouse(this)[1];

        // Si la position de la souris est en dehors de la zone du graphique, on masque la ligne et le tooltip
        if (mouse_x < margin.left || mouse_x > (width + margin.left) || mouse_y < margin.top || mouse_y > (400 - margin.bottom))
        {
            div.style("opacity", 0);
            verticalLine.style("opacity", 0);
        }
    });
}

