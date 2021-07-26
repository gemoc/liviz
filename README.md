# Liviz

Framework for plotting during a debugging session.

Written in pure js.

## Require


* RabbitMQ 3.8.19
* StompJs
* D3Js v4
* Bootstrap v5.0.1




## Incremental Plotter

![](https://i.ibb.co/G2pbQbV/index.png)

This framework allows to display 2D curves in GNU Plot format (https://people.duke.edu/~hpgavin/gnuplot.html) incrementally, using the d3js library. The communication of the curve is done via a websocket chatting with a RabbitMQ server. 


## Context

 In this context, it is used to follow the evolution of the value of variables resulting from the interpretation of a nablab program. The interpreter communicates the values which will be plotted in real time by the framework. 

 ## Todo list

- [x] Scatter plot
- [ ] Line chart
- [ ] Box plot
- [ ] Export in GNUPlot format
- [ ] Sliding Window
- [x] Resizing axes (zoom, unzoom)


 * 
 * Boxe plot
 * Resizing axes (zoom, unzoom)
 * Incremental display 
 * Export in GNUPlot format 
 * Sliding Window