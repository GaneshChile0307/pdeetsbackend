
# Pdeets app poc API
The repository contains code for the backend API of planspiel poc app Version 2.

## Follow below steps to start the api locally
- please enure that you have installed docker and docker-compose on your system.
- Step 1: Open command prompt or terminal and move to the root location of the backend api code.
- Step 2: Run - docker-componse up
- Step 3: The api will be running locally on the port 5000. (see the logs in terminal).

## Config
- The configurations can be changed via .env file. It allows you to run the application on different port, change credentials etc.

## Commands
- docker-compose up
- docker-compose down

## Documentation details
- The docks will be at http://www.localhost:5000/v2/api-docs once the docker-compose command spin up the required containers.

## Environment
- Node.js 18.x
- Express
- PostgreSQL
- Redis
- Docker