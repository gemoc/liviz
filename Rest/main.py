from Network.server import Server
from Rendering.plotter import Plotter
from threading import Thread

import Api.plot_api as plot_api



class Core:

    def run():

        HOST = "127.0.0.1"
        server = Server(HOST)
        thread = Thread(target = server.start, args = ())
        thread.start()

        

        plot_api.run()

        
  
        


Core.run()


