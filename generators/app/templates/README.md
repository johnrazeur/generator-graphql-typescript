# <%= name %>

<%= description %>

## Quick Start

First modify the `ormconfig.json` file and put your database configuration.

```bash
# install deps
npm install

# run in development mode
# server will listen the 4000 port
npm run start

# run tests
npm run test
```

## Queries

### Login

```graphql
query {
  login(login: {email: "test@github.com", password: "s3cr3tp4ssw0rd"})
}
```

### Get projects

You need to put the token you get from the login query to perform this query. Prefix the authorization header with `bearer`.

```json
{
  "Authorization": "bearer thetoken"
}
```

```graphql
query {
  projects { 
    name,
    owner { email }
  }
} 
```

## Mutations

### Register

```graphql
mutation {
  register(user: {username: "test", email:"test@gmail.com", password: "pass", confirmPassword: "pass"}) {
    username
  }
}
```

### Add project

You need to put the token you get from the login query to perform this query. Prefix the authorization header with `bearer`.

```json
{
  "Authorization": "bearer thetoken"
}
```

```graphql
mutation {
  addProject(project: { name: "test"}) {
    name,
    owner { email }
  }
}
```
