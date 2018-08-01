FROM node:10
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
EXPOSE 3000
CMD ["yarn", "start"]