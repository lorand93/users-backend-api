## Description
This is an implementation for the holiday extras coding challenge.

For implementing I chose Nest.js, Typescript, TypeORM and SQLITE.

For unit testing I chose Jest, and I wrote unit tests for the services and controllers.

For e2e testing I chose Supertest, and I wrote e2e tests for the users routes.

You can access the documentation after starting the app by going to
http://localhost:3000/docs/

## Installation
For developing and running this project I recommend using node v14.16.1
In order to install app dependencies you have to run:
```bash
$ npm install
```

## Running the app
In order to start the app locally you can run:
```bash
$ npm run start
```
Other running modes:
```bash
# development watch mode (with auto reload)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
In order to run the unit tests you can run:
```bash
# unit tests
$ npm run test
```
In order to get the coverage for the unit tests you can run:
```bash
# unit tests
$ npm run test:cov
```
A report will be generated in the console, and also a html report that you can find here:```backend/coverage/lcov-report/index.html```

In order to run e2e tests you can run:
```bash
# run e2e tests
$ npm run test:e2e
```
- the e2e tests use a test database
- they test actions against an actual database


## Project requirements
Your solution _must_:

- Expose a **user** model. It's reasonable to expect that a user has (at least) the following attributes:
    - **`id`** - _a unique user id_
    - **`email`** - _a user's email address_
    - **`givenName`** - _in the UK this is the user's first name_
    - **`familyName`** - _in the UK this is the user's last name_
    - **`created`** - _the date and time the user was added_
- Have the ability to persist user information for at least the lifetime of the test.
- Expose functionality to create, read, update and delete (CRUD) users.
- Be easily consumable by a plain HTTP client (e.g. cURL or Postman) or, if using a transport other than HTTP, be trivial to write a client application to consume it.


## Stay in touch

- Author - [Lorand Sandor](https://www.linkedin.com/in/sandorlorand/) 
- Email: [sandor.lorand93][@][gmail.com]

