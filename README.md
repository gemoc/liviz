# Liviz

Framework for plotting during a debugging session. The renderer is written in VanillaJS. This renderer is provided by a rest API using NodeJs and ExpressJS

## Require
 
* RabbitMQ 3.8.19 (Docker setup recommended)
* StompJs 6.1.0
* D3Js v4
* Bootstrap 5.0.1
* node 14.17.1
* npm 6.14.13
* express js *(npm install express --save)*

## Incremental Plotter

![](https://i.ibb.co/G2pbQbV/index.png)

This framework allows to display 2D curves in GNU Plot format (https://people.duke.edu/~hpgavin/gnuplot.html) incrementally, using the d3js library. The communication of the curve is done via a websocket chatting with a RabbitMQ server. 

In this context, it is used to follow the evolution of the value of variables resulting from the interpretation of a nablab program. The interpreter communicates the values which will be plotted in real time by the framework. 


![](Misc/rd.png)
 
## Content

This repository contains: 

* **Scripts** : Contains linux scripts (sudo required) allowing to launch rabbitmq and the plugins necessary for the proper functioning of StompJs
* **Visualizer** : The sources of the plotter written in pure javascript 
* **Rest** : A rest API written in python allowing to fetch configurable plots 
* **Example Files** : Examples of GnuPlot files that can be displayed using the javascript viewer. 

## How to use

you can launch the Rest Api by executing this command: 

```
node Sources/app.js.
```

> Release & Dockerization required
