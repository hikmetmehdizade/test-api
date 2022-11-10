FROM node:16.18.1-alpine

WORKDIR /usr/src

COPY package*.json ./

RUN npm install -g nodemon && npm install

COPY . .

EXPOSE 4000

CMD ["nodemon", "server.js"]