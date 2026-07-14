FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json

RUN npm install

COPY . .

WORKDIR /usr/src/app/client
RUN npm run build

WORKDIR /usr/src/app/server
RUN npm install --production

EXPOSE 5000
CMD ["npm", "run", "start"]
