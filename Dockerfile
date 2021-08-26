
# FROM nginx:latest
FROM scratch


WORKDIR /home/marius/Bureau/liviz

#RUN chmod 0755 Scripts/
ADD Scripts Scripts/

#RUN chmod 0755 Sources/
ADD Sources Sources/

EXPOSE 80


CMD Sources/start.sh

