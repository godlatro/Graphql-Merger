# Graphql-merger
Merge All *.graphql files in dir in JS
My merger dont need any dependency (only [fs]), small and simple;

# WTF?

You can use this module to easy add all `*.graphql` files to project for `Apollo Graphql Server`


# install
`npm i graphql-merger`
or just insert `index.js`, and rename it as you wish

1. Add all `*.graphql` files into Dir like `Shemas`
```
  .\Shemas\
            user.graphql
            books.graphql
            index.js
```

## *user.graphql*
 ```javascript
 type User {
   name: String #comment
   password: String
 }
 
 type Query {
   users: [User]
 }
 type Mutation {
   user(name: String): User
 }
 ```

## *books.graphql*
 ```javascript
 type Book {
   name: String #comment
   author: [User]
 }
 #comment
 type Query {
   books: [Book]
 }
  type Subscription {
   users: [User]
   books: [Book]
 }
 type Mutation {
   book(name: String): Book
 }
 ```
## *index.js*
 ```javascript
const { gql } = require('apollo-server-express');
const { merger } = require('graphql-merger');
const typeDefs = merger({ dir: __dirname, debug: false });
module.exports.typeDefs = gql(typeDefs);
 ```
 

## options
*debug* - show result in console.log --- `true` or `false`
*replace* - replace bad schemas how can, default `true` --- `true` or `false`
*type* - choose file types, default is `*.graphql`, but if you want reanme your files in other type, like `*.g` or `*.gql`, you can set this
*dir* - choose scan dir with `*.graphql` files
