
class Settings
{
    static getAxisBounds()
    {
        return [document.getElementById('xMin').value, document.getElementById('xMax').value,
        document.getElementById('yMin').value, document.getElementById('yMax').value];
    }
    static getVariableColor(variableName)
    {
        console.log("Vname is " + variableName);

        return document.getElementById("color-" + variableName).value;
    }
    static bindEvents()
    {
        var button = document.getElementById('apply');

        button.onclick = function ()
        {
            var graph = Plotter.graphs.values().next().value;
            var [xMin, xMax, yMin, yMax] = Settings.getAxisBounds();
            graph.rescale(xMin, xMax, yMin, yMax);
        }


    }

}