# Create image based on the official Node 10 image from dockerhub
FROM node:12

# ENV http_proxy http://proxy.logica.com:80
# ENV https_proxy http://proxy.logica.com:80

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /app/

# Expose the port the app runs in
EXPOSE 80

# Serve the app
CMD ["npm", "start"]