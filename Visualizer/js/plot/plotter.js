
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

                console.log(Plotter.graphs);
                console.log("end.");
            }
        }
    }

    static onReceive(graphName, variableName, obj)
    {
        Plotter.graphs.get(graphName).append(variableName, obj);
    }

    static createGraph(indice, graphData)
    {
        var graphType = graphData['type'];

        var graphName = graphData['name'];

        switch (graphType)
        {
            case 'chart':
                return new LineChart(graphName, indice);
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