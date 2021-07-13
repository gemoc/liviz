import pika
import json
from Rendering.plotter import Plotter

CONFIG_QUEUE = 'config'

# This datas must be retreived from a data adapter
# each time we update values.
class Server:

    def __init__(self,host):
        self.host = host
        self.config = dict()

    def start(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(self.host))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=CONFIG_QUEUE)

        self.channel.basic_consume(queue=CONFIG_QUEUE,
                      auto_ack=True,
                      on_message_callback=self.callback)

        print("server started : "+self.host)
        self.channel.start_consuming()

    def callback(self, ch, method, properties, body):
        data = json.loads(body)
        if method.routing_key == CONFIG_QUEUE:
            self.update_config(data)
        else:
            Plotter.instance.append_graph_values(method.routing_key,data)


    def update_config(self,config):
        Plotter.instance.flush()
        Plotter.instance.config = config
        graphs = Plotter.instance.config['graphs']
        print("Config updated : "+str(len(Plotter.instance.config['graphs']))+" graphs.")

        for graph in graphs:
            queue_name = graph['name']

            self.channel.queue_declare(queue_name)
            self.channel.basic_consume(queue=queue_name,
                      auto_ack=True,
                      on_message_callback=self.callback)
            