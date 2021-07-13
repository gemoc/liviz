import flask
from flask import send_file
from flask import make_response
from Rendering.plotter import Plotter

app = flask.Flask(__name__)
app.config["DEBUG"] = False

@app.route('/', methods=['GET'])

def home():

    image =  Plotter.instance.plot()
    if (image == None):
        return "Plot is empty."
    else:
        return '<svg  width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg">'+image.decode('utf-8')+'</svg>'



def run():
    app.run()

