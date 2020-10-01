FROM node:12

ENV http_proxy http://proxy.logica.com:80
ENV https_proxy http://proxy.logica.com:80

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]