FROM node:alpine

ENV PORT 3001
ENV SQLDB Server=tcp:criptocountry.database.windows.net,1433;Initial Catalog=criptoland;Persist Security Info=False;User ID=criptoadmin;Password={};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;

WORKDIR /backend

COPY package*.json ./

RUN npm cache clean --force
RUN npm install && npm install typescript -g

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "./dist/index.js"]
