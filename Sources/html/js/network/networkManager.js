class NetworkManager
{
    static API_URI = "http://localhost:3000/";




    requestConfig()
    {
        console.log("Waiting for configuration ... ")
        Utils.httpGetAsync(NetworkManager.API_URI + "config", this.onConfigReceive.bind(this), this.onConfigError.bind(this));
    }

    bindQueues()
    {
        var url = NetworkManager.API_URI + "graphs";

        var graphs = Plotter.config['graphs'];

        for (let i = 0; i < graphs.length; i++)
        {
            var graphData = graphs[i];

            var graphName = graphData['name'];

            var uuid = Utils.httpGet(url + "/" + graphName);

            Plotter.mapping.set(uuid, graphName);

            this.client.subscribe("/amq/queue/" + uuid,
                this.onReceiveData);

            console.log("Subscribed to " + graphName + " (" + uuid + ")");

        }

    }

    async onConfigError(statusCode)
    {
        console.log("Unable to retreive configuration.");

        await new Promise(resolve => setTimeout(resolve, 3000));

        Utils.httpGetAsync(NetworkManager.API_URI + "config", this.onConfigReceive.bind(this), this.onConfigError.bind(this));
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
        var uuid = d.headers.destination.replace("/queue/", "");

        var graphName = Plotter.mapping.get(uuid);

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
        console.log("Connecting to RabbitMQ...");

        this.ws = new WebSocket('ws://localhost:15674/ws');
        this.client = Stomp.over(this.ws);
        this.client.debug = null


        var on_connect = function ()
        {
            console.log("Connected to RabbitMQ.");
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