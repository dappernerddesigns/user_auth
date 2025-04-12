# User Auth

A small express server connected with a postgres databse for the storage and authentication of users.

Using github actions, this repo will run a small pipeline when pushing to main or any branch.

If all unit tests pass, the latest commit will be deployed from Render - the live service can be found [here](https://user-auth-k2wn.onrender.com/api)

## Live api

This api has been hosted on Render [here](https://user-auth-k2wn.onrender.com/api). As this is a free tier for the purpose of this repo, the service will spin down from inactivity and can take up to 50 seconds to respon.

## Local Setup

To run this locally users must have:

- psql version 17
- node >version 20
- rights to create databases

1 - Clone the repo and install all dependancies

```
git clone https://github.com/dappernerddesigns/user_auth
cd user_auth
npm i
```

2 - Create .env.test and .env.development to hold `PGDATABASE` variables

```
PGDATABASE=cromwell_tech
```

3 - Run the following commands in order

```
npm run setup_dbs // establishes test and development databases
npm run seed // seeds the development database
npm test // runs all integration tests, and seeds test database
npm start // starts the server locally
```
