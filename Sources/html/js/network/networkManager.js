class NetworkManager
{
    static API_URI = "http://localhost:3000/";

    constructor()
    {
        this.ws = new WebSocket('ws://localhost:15674/ws');
        this.client = Stomp.over(this.ws);
        this.client.debug = null
    }

    requestConfig()
    {
        console.log("Waiting for configuration ... ")
        var url = NetworkManager.API_URI + "config";
        Utils.httpGetAsync(url, this.onConfigReceive.bind(this), this.onConfigError.bind(this));
    }

    bindQueues()
    {
        var url = NetworkManager.API_URI + "graph";

        var graphs = Plotter.config['graphs'];

        for (let i = 0; i < graphs.length; i++)
        {
            var graphData = graphs[i];

            var graphName = graphData['name'];

            var uuid = Utils.httpGet(url + "?name=" + graphName);

            Plotter.mapping.set(graphName, uuid);

            this.client.subscribe("/amq/queue/" + "myGraph",
                this.onReceiveData);

            console.log("Subscribed to " + graphName + " (" + uuid + ")");

        }



    }

    onConfigError(statusCode)
    {
        console.log("Unable to retreive configuration.");
    }
    onConfigReceive(body)
    {
        console.log("Configuration : " + body);
        var jsonData = JSON.parse(body);
        Plotter.config = jsonData;

        Plotter.flush();
        Plotter.initialize();

        this.connectWebSocket();

    }

    onReceiveData(d)
    {
        console.log("We received new data.");

        var graphName = d.headers.destination.replace("/queue/", "");

        var plotData = new PlotData(d.body);

        if (!plotData.valid)
        {
            console.log("Malformated Gnu plot data");
            return;
        }

        Plotter.onReceive(graphName, plotData);
    }


    connectWebSocket()
    {
        var on_connect = function ()
        {
            this.bindQueues();

        }.bind(this);

        var on_error = function (error)
        {
            console.log("WebSocket error : " + error);
        };

        this.client.connect('guest', 'guest', on_connect.bind(this), on_error, '/');
    }

    initialize()
    {
        this.requestConfig();
    }
}