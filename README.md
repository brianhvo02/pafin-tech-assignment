# Tech Assignment - Backend Data Handling

## Objective
The objective of this assignment is to evaluate my skills in handling data on the backend using Node.JS and PostgreSQL.

## Libraries
This API uses the following libraries:
1. Express - a web application framework for Node.js to create a robust API
2. Passport - an authentication middleware for Express
3. passport-jwt - a Passport extension using JWT tokens for authentication
4. jsonwebtoken - a Node.js implementation of JSON Web Tokens
5. node.bcrypt.js - a library to hash passwords
6. Sequelize - a Node.js Object Relational Mapping (ORM) for databases
7. node-postgres - a collection of Node.js modules for interfacing with PostgreSQL databases
8. Jest - a JavaScript testing framework

## How to Use
Gather your environment variables into a `.env` file or into the command-line:

| Variable    |                     Description                      |
| ----------- | ---------------------------------------------------- |
| DB_NAME     | Name of the database.                                |
| DB_USER     | A database user with read/write privileges.          |
| DB_HOST     | The database host address.                           |
| DB_PASSWORD | The database user's password.                        |
| JWT_KEY     | A random 32-byte key in hex used to sign JWT tokens. |

If you have `openssl` installed, you can run the following command to get your JWT key:
```bash
openssl rand -hex 32
```

Or you can use the Node.js `crypto` module in the REPL environment:
```javascript
require('crypto').randomBytes(32).toString('hex');
```

Install all prerequisite packages and start the webserver:
```bash
npm install
npm start
```

## Routes

To see the following examples in action, you can also run the `example.js` file.

### POST /signup
Create a new user.

| Header       | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

| Parameter | Description               |
| --------- | ------------------------- |
| name      | The user's name.          |
| email     | The user's email address. |
| password  | The user's password.      |

#### Example

```javascript
const result = await fetch(URL + '/signup', {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json'
   },
   body: JSON.stringify({
      name: 'John Doe',
      email: 'jdoe@test.com',
      password: 'Password123'
   })
}).then(res => res.status);

console.log(result);
```

```json
{
   "token": "eyJhbGciOi...eI_I9gyJjQ"
}
```

### POST /login

| Header       | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

| Parameter | Description               |
| --------- | ------------------------- |
| email     | The user's email address. |
| password  | The user's password.      |

#### Example

```javascript
const result = await fetch(URL + '/login', {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json'
   },
   body: JSON.stringify({
      email: 'jdoe@test.com',
      password: 'Password123'
   })
}).then(res => res.json());

console.log(result);
```

```json
{
   "token": "eyJhbGciOi...eI_I9gyJjQ"
}
```

### GET /user

| Header        | Value              |
| ------------- | ------------------ |
| Content-Type  | application/json   |
| Authorization | Bearer [JWT Token] |

#### Example

```javascript
const user = await fetch(URL + '/user', {
   method: 'GET',
   headers: {
      'Authorization': `Bearer ${token}`
   }
}).then(res => res.json());

console.log(user);
```

```json
{
  "id": "92e96faf-fda6-451c-bf54-88d846827585",
  "name": "John Doe",
  "email": "jdoe@test.com"
}
```

### PATCH /user

| Header        | Value              |
| ------------- | ------------------ |
| Content-Type  | application/json   |
| Authorization | Bearer [JWT Token] |

| Parameter           | Description               |
| ------------------- | ------------------------- |
| name (optional)     | The user's name.          |
| email (optional)    | The user's email address. |
| password (optional) | The user's password.      |

#### Example

```javascript
const updatedUser = await fetch(URL + '/user', {
   method: 'PATCH',
   headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   },
   body: JSON.stringify({
      name: 'Jane Doe'
   })
}).then(res => res.json());

console.log(updatedUser);
```

```json
{
  "id": "92e96faf-fda6-451c-bf54-88d846827585",
  "name": "Jane Doe",
  "email": "jdoe@test.com"
}
```

### DELETE /user

| Header        | Value              |
| ------------- | ------------------ |
| Authorization | Bearer [JWT Token] |

#### Example

```javascript
const result = await fetch(URL + '/user', {
   method: 'DELETE',
   headers: {
      'Authorization': `Bearer ${token}`
   }
}).then(res => res.json());

console.log(result);
```

```json
{
   "success": true
}
```