FROM node:16.18.1-alpine


WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install -g nodemon prisma copyfiles typescript ts-node

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]