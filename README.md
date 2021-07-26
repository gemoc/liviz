# Liviz

Framework for plotting during a debugging session.

Written in pure js.

## Require


* RabbitMQ 3.8.19
* StompJs
* D3Js v4
* Bootstrap v5.0.1

![](https://i.ibb.co/G2pbQbV/index.png)


## Incremental Plotter

This framework allows to display 2D curves in GNU Plot format (https://people.duke.edu/~hpgavin/gnuplot.html) incrementally, using the d3js library. The communication of the curve is done via a websocket chatting with a rabbitMQ server. 


## Context

 In this context, it is used to follow the evolution of the value of variables resulting from the interpretation of a nablab program. The interpreter communicates the values which will be plotted in real time by the framework. 

 ## Functionalities

 * Scatter plot
 * Boxe plot
 * Resizing axes 
 * Incremental display 
 * Export in GNUPlot format 