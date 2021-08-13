curl -d 'config={"graphs":[{"variables":["maVariable","var2"],"window":"0","name":"myGraph","x":"time","type":"points"}]}' -H "Content-Type: application/x-www-form-urlencoded" -X PUT http://localhost:3000/config

