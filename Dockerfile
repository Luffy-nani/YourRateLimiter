FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#To get the port
EXPOSE 3000 
# We cannot use this in RUN because...RUN runs when building the image
CMD [ "npm","start" ]