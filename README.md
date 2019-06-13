# Graphql-files-merge-JS
Merge All *.graphql files in dir in JS
My merger dont need any dependency (only [fs]), small and simple;

# WTF?

You can use this module to merge all your `*.graphql` files for `Apollo Graphql Client`

## Example Schemas:

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
 type Mutation {
   book(name: String): Book
 }
 ```

## *Exported schema after merge*
 ```javascript
 type User {
   name: String
   password: String
 }
 
 type Book {
   name: String
   author: [User]
 }
 
 type Query {
   users: [User]
   books: [Book]
 }
 type Mutation {
   user(name: String): User
   book(name: String): Book
 }
 ```


## How to Use

You can donwload and unzip `index.js` to your graphql dir, rename it as you wish, like `GMerger.js`
then import it in js.

```javascript
const { gql } = require('apollo-server');
const {merger} = require('./GMerger');
const typeDefs = merger();`
module.exports.typeDefs = gql(typeDefs);
```

## options

`const typeDefs = merger({ debug: true, type: 'graphql', dir: '/usr/node/graphql' });`

*debug* - show result in console.log --- `true`
*type* - choose file types, default is `*.graphql`, but if you want reanme your files in other type, like `*.g` or `*.gql`, you can set this
*dir* - choose scan dir with `*.graphql` files

## На русском

это маленький модуль который не имеет внешних зависимостей, и который можно подключить как JS файл или как NPM зависимость
С помощью этого модуля можно объединить все `*.graphql` файлы для импорта в клиент `Apollo Graphql Client`
