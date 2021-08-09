
class Plotter
{
    static data = []
    static config = null;
    static graphs = []

    constructor()
    {

        Plotter.graphs = []
    }


    static initialize()
    {
        Plotter.graphs = new Map()

        for (let i = 0; i < Plotter.config['graphs'].length; i++)
        {
            var graphData = Plotter.config['graphs'][i];
            var graph = this.createGraph(i, graphData);

            if (graph != null)
            {
                graph.initialize();
                Plotter.graphs.set(graph.name, graph);
            }
        }
    }

    static onReceive(graphName, plotData)
    {
        var graph = Plotter.graphs.get(graphName)

        var graphMeta = graph.getMetadata();

        for (const variableName of graphMeta['variables'])
        {
            var data = plotData.getPlot(variableName, graphMeta['x']);

            graph.onReceive(variableName, data);
        }

    }

    static createGraph(indice, graphData)
    {
        var graphType = graphData['type'];

        var graphName = graphData['name'];

        switch (graphType)
        {
            case 'points':
                return new Points(graphName, indice);
            default:
                console.log("Unhandled graph type : " + graphType);
                break;
        }

        return null;

    }

    static flush()
    {
        for (let [graphName, graph] of Plotter.graphs)
        {
            graph.remove();
        }

        Plotter.graphs = new Map();
    }

}