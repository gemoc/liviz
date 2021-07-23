import pika
import time
import numpy as np

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='config')
channel.queue_declare(queue='myGraph')


config = '{"graphs":[{"variables":["maVariable","var2"],"window":"0","name":"myGraph","x":"time","type":"points"}]}' # {"variables" :{"maVariable2":"#3498db"},"name":"graph2","x":"time","type":"boxes"}

channel.basic_publish(exchange='',  
                      routing_key='config',
                      body=config)
                      
print("Sent Config")

for x in range(0, 1000):

    values = '{"var2":"'+str(np.sin(x))+'","time":"'+str(x*0.01)+'"}'
    values2 = '{"maVariable":"'+str(np.cos(x))+'","time":"'+str(x*0.01)+'"}'
    
    channel.basic_publish(exchange='',
                      routing_key='myGraph',
                      body=values2)

    channel.basic_publish(exchange='',
                      routing_key='myGraph',
                      body=values)

    

    time.sleep(0.2)
    
    print(values)

