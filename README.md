# Factorial Technical Assessment

Technical excersise for the Factorial technical interview.
This is a contacts application with the following functionality:

>A Frontend + Backend application that allows you to create, read, update and delete a list of contacts. Each contact will have: First name, Last name, Email, and phone number. All the fields are mandatory and there can’t be two contacts with the same email. You should be able to see the history of edits on those contacts. The contacts will be persisted in the database.


## Tech Stack

**Client:** React

**Server:** .NET Core Web API

**Database:** Postgresql


## Installation

You need to have Docker desktop client or Docker Compose installed to run this application. You can install Docker Compose via [this link](https://docs.docker.com/compose/install/).


Once installed, run the following commands to start the containers. Everything should work out of the box and you should be able to view the application at `http://localhost:3000`
```
# Build and start all the containers  
docker-compose up --build
```
    
