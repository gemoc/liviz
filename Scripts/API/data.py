
import numpy as np


import requests
import time


for x in range(0, 1000):

    values = """# var2          maVariable      time  
    """+str(np.sin(x))+""" """+str(np.cos(x))+"""  """+str(x*0.01)
  
    r = requests.put("http://localhost:3000/graphs/myGraph", data=values,headers={"content-type":"text/plain"})
    

    print(r)

    time.sleep(0.2)
    
    print("Send: "+str(np.sin(x))+" "+str(np.cos(x))+" "+str(x*0.01))

