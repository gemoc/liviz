# syntax=docker/dockerfile:1

FROM node:14.17.1

ENV NODE_ENV=production

WORKDIR .

#RUN chmod 0755 Scripts/
ADD Scripts Scripts/

#RUN chmod 0755 Sources/
ADD Sources Sources/

EXPOSE 80


RUN npm install --production


CMD Scripts/rabbitmq.sh # rmq docker
CMD Scripts/plugins.sh # stomp

CMD Sources/run.sh # rest api


