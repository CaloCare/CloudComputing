FROM node:18.20.5
WORKDIR /app
ENV PORT 9000
COPY . .
RUN npm install
EXPOSE 9000
CMD [ "npm", "run", "start"]