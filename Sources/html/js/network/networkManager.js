class NetworkManager
{
    static API_URI = "http://localhost:3000/";

    constructor()
    {
        this.ws = new WebSocket('ws://127.0.0.1:15674/ws');
        this.client = Stomp.over(this.ws);
        this.client.debug = null

    }


    requestConfig()
    {
        console.log("Waiting for configuration ... ")
        var url = NetworkManager.API_URI + "config";
        Utils.httpGetAsync(url, this.onConfigReceive.bind(this), this.onConfigError.bind(this));
    }

    onConfigError(statusCode)
    {
        console.log("unable to retreive config");
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
            for (let i = 0; i < Plotter.config['graphs'].length; i++)
            {
                var graphData = Plotter.config['graphs'][i];

                this.client.subscribe("/amq/queue/" + graphData['name'],
                    this.onReceiveData);

            }
        };

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