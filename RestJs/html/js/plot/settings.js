
class Settings
{
    static getAxisBounds()
    {
        return [document.getElementById('xMin').value, document.getElementById('xMax').value,
        document.getElementById('yMin').value, document.getElementById('yMax').value];
    }
    static getVariableColor(variableName)
    {
        return document.getElementById("color-" + variableName).value;
    }

    static openFile(e)
    {
        var file = e.target.files[0];

        var reader = new FileReader();

        reader.onload = function (e)
        {
            var contents = e.target.result;

            var plotData = new PlotData(contents);

            if (!plotData.valid)
            {
                window.alert("Unable to process file, malformated Gnu plot data");
                return;
            }

            Plotter.onReceive("myGraph", plotData); // todo , create new graph ? append to new graph ?

        };
        reader.readAsText(file);
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

        document.getElementById('openPlot')
            .addEventListener('change', Settings.openFile, false);
    }

}