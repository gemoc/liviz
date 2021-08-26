# syntax=docker/dockerfile:1

FROM node:14.17.1


ENV NODE_ENV=production

WORKDIR .

#RUN chmod 0755 Scripts/
ADD Scripts Scripts/

#RUN chmod 0755 Sources/
ADD Sources Sources/


RUN npm install --production


RUN npm install amqplib@0.8.0
RUN npm install express@4.17.1 --save
RUN npm install uuid@8.3.2




 # web api port
EXPOSE 3000



# web api
CMD node Sources/app.js 





#CMD rabbitmq rabbitmq-plugins enable rabbitmq_web_stomp
