# MEAN Career Tracker

This project is a career development tracker for CGI UK.
Contact james.mcnicholas1@gmail.com for any queries

## Navigation

The source code for the backend is stored in the `/server` directory

Source code for the frontend is store in `/src/app`


## Running Locally

Ensure docker is installed

run `docker-compose up --build -d` to create and start the docker containers

Navigate to `http://localhost:8080/` and sign into keycloak using `user: admin`  `password: admin`

Import the `realm-export.json` file to configure keycloak

Navigate to `http://localhost:4200/` to see the app running


## Development 

Stop the Angular container

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

