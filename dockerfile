FROM node:alpine

WORKDIR /backend

COPY package*.json ./

RUN npm cache clean --force
RUN npm install && npm install typescript -g

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "dev"]
