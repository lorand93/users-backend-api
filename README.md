<p align="center">
  <a href="https://www.holidayextras.com/" target="blank"><img src="https://d17s4kc6349e5h.cloudfront.net/holidayextras/assets/images/logos/HolidayExtras-logo-horizontal-transparent.svg" width="200" alt="Logo" /></a>
</p>

## Description
This is an implementation for the holiday extras coding challenge.

For implementing I chose Nest.js, Typescript, TypeORM and SQLITE.

For unit testing I chose Jest, and I wrote unit tests for the services and controllers.

For e2e testing I chose Supertest, and I wrote e2e tests for the users routes.

## Installation
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

## Stay in touch

- Author - [Lorand Sandor](https://www.linkedin.com/in/sandorlorand/) 
- Email: [sandor.lorand93][@][gmail.com]
