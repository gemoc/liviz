
class Connection 
{
    constructor()
    {
        this.ws = new WebSocket('ws://127.0.0.1:15674/ws');
        this.client = Stomp.over(this.ws);
        this.client.debug = null
    }

    on_receive(d)
    {
        console.log(d.body);

        var plotData = new PlotData(d.body);

        if (!plotData.valid)
        {
            console.log("Malformated Gnu plot data");
            return;
        }

        /*   var graphName = d.headers.destination.replace("/queue/", "");
   
           var jsonData = JSON.parse(d.body);
   
           var jsonKeys = Object.keys(jsonData);
   
           var variableName = jsonKeys[0];
   
           var targetField = jsonKeys[1];//  Object.keys[jsonData]
   
           var yDelta = jsonData[variableName];
   
           var xDelta = jsonData[targetField];
   
           var obj =
           {
               date: xDelta,
               close: yDelta,
           } */

        Plotter.onReceive(graphName, variableName, obj);

    }
    onConnect()
    {

    }
    connect()
    {
        var on_connect = function ()
        {
            var client = this.client;
            var on_receive = this.on_receive;

            var id = this.client.subscribe("/amq/queue/config", function (d) 
            {
                console.log("Configuration : " + d.body);
                var jsonData = JSON.parse(d.body);
                Plotter.config = jsonData;

                Plotter.flush();
                Plotter.initialize();

                for (let i = 0; i < Plotter.config['graphs'].length; i++)
                {
                    var graphData = Plotter.config['graphs'][i];

                    client.subscribe("/amq/queue/" + graphData['name'], on_receive);

                }


            });


        };
        var on_error = function (error)
        {
            console.log("WebSocket error : " + error);
        };

        this.client.connect('guest', 'guest', on_connect.bind(this), on_error, '/');

    }
}
