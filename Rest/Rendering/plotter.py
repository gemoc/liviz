import time
import matplotlib.pyplot as plt
import numpy as np
import io


class Plotter:
    
    instance = None
    # Aggregated variable values.
    graphs = dict()

    def __init__(self):
        
        self.config = {
            "graphs": []
        }

    # Append the new variable values to self.variable
    # The frame is read using a DataAdapter
    def append_graph_values(self,graph_name,values):
        
        iterator = iter(values)

        key = next(iterator) 
        value = next(iterator)

        if graph_name in self.graphs:

            if key not in self.graphs[graph_name]:
                self.graphs[graph_name][key] = dict()


            self.graphs[graph_name][key].update({values[value]:  values[key]})
            
        else:
            print("New graph created :  "+graph_name)
            
            self.graphs[graph_name] = dict()

            self.graphs[graph_name][key] = dict()

            self.graphs[graph_name][key].update({values[value]:  values[key]})

            

        print(self.graphs[graph_name])
    
    def flush(self):
        graphs = dict() 
    # Start plotting
    def plot(self):

        # while .. ? replace it by a background thread ? Then adapters calls should be threadsafe
        
        graph_definitions = self.config['graphs'] # This data
       
        count = len(graph_definitions) # The number of graphs displayed
        
        print("Plotting "+str(count)+" graphs...")

        if count > 0:

            fig, axs = plt.subplots(count, sharex=False, sharey=False) # We create matplotlib plots.

            fig.suptitle('Variable view') # whatever title

            plot_id = 0 # The graph uid

            for graph_definition in graph_definitions:

                graph_name = graph_definition['name']

                if graph_name not in self.graphs:
                    self.graphs[graph_name] = dict()
                # The current variable values
                graph = self.graphs[graph_name]

                for variable_name in graph.keys():

                    if variable_name not in graph:
                        graph[variable_name] = dict()

                    color = graph_definition['variables'][variable_name]
                    fig.subplots_adjust(hspace=.5)
                    data = graph[variable_name] 

                    keys = np.fromiter(data.keys(),dtype=float)
                    values = np.fromiter(data.values(),dtype=float)

                    axs[plot_id].plot(keys, values,color, label = variable_name) # X, VALUES
                    
                axs[plot_id].legend()
                axs[plot_id].set(xlabel = graph_definition['x']) # display the x axis for the concerned plot
                plot_id = plot_id + 1
            
            buf = io.BytesIO()
            plt.savefig(buf, format='svg')
            buf.seek(0)
            return buf.read()


Plotter.instance = Plotter()