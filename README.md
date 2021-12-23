openapi: 3.0.0
info:
version: "1.0.0"
title: User Management
description: >
This is a sample API for managing a database of users. User accounts can be created, edited, and retrieved.
Users can also login, for hashing used crypto.pbkdf2

host: **localhost:3000**

consumes:

- application/json
  produces:
- application/json

definitions:

# A simple username/password combo for logging in

signin:
required: [username, password]
properties:
username:
type: string
minLength: 4
password:
type: string
minLength: 5

User Schema:
parameters:
username: {
required: true
type: string
min: 4
max: 45
}
firstName: {
type: string
min: 2
max: 20  
 }
lastName: {
type: string
min: 2
max: 20
}
password: {
required: true
type: string
min: 6
max: 1000  
 }
salt: {
type: string
}

paths:
**/users**
method.get
summary: Returns all users in the database. description: Everyone have access.
responses:
200:
description: Returns the list of users
schema:
type: array

paths:
**/users?pageNumber={number}&nPerPage={number}**
method.get
summary: Returns all users in the database. description: Everyone have access.
responses:
200:
description: Returns the list of users
schema:
type: array

paths:
**/user/signup**
method.post

summary: Creates a new user
description: Everyone can access.
parameters:
username: username - required: true
password : password - required: true
firstname: firstName  
lastname: lastName
in: body
schema:
$ref: user
description: The user account to create
responses:
201:
description: New user was created successfully

paths:
**/user/signin**
method.post
description: Only user can access.
parameters:
username: username - required: true
password : password - required: true
in: body
schema:
$ref: user
description: Login to user acount
responses:
201:
description: Logged in successfully

paths:
**/user/:id**
method.get
summary: Retrieves a user profile information
description: Everyone can retrieve user firstname and lastname
parameters: - \*id
responses:
200:
description: Returns the user's data
schema:
$ref: user

paths:
**/user/:id/update-profile**  
method.post
summary: Edits a user
description: Only user can change it's own firstname or lastname
parameters: - \*id
responses:
200:
description: Profile updated successfully
schema:
$ref: user
404:
description: The username was not found

paths:
**/user/:id/update-password**  
method.post
summary: Edits a user's password
description: Only user can change it's own password
parameters: - \*id
responses:
200:
description: Password updated successfully
schema:
$ref: user
404:
description: The username was not found
