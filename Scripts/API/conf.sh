curl -d '{"graphs":[{"variables":["maVariable","var2"],"window":"0","name":"myGraph","x":"time","type":"points"}]}' -H "Content-Type:text/plain" -X PUT http://localhost:3000/config

