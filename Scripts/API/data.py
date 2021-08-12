
import numpy as np


import requests
import time




for x in range(0, 1000):

    values = """data=# var2          maVariable      time  
    """+str(np.sin(x))+""" """+str(np.cos(x))+"""  """+str(x*0.01) +"""&graphName=myGraph"""
    
    
    r = requests.put("http://localhost:3000/graph", data=values,headers={"content-type":"application/x-www-form-urlencoded"})
    

    print(r)

    time.sleep(0.2)
    
    print("Send: "+str(np.sin(x))+" "+str(np.cos(x))+" "+str(x*0.01))

