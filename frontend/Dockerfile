FROM node:15.5.0-alpine

WORKDIR /app/
COPY package.json .
RUN npm install --no-dev
COPY . .
RUN npm run build
RUN chmod +x sync-production-files.sh

CMD ./sync-production-files.sh
