FROM node:lts-alpine
RUN mkdir /server
COPY . /server
WORKDIR /server
RUN npm install
ENTRYPOINT npm start
