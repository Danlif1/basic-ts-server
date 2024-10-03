# basic-ts-server

### This repo is meant to be a basic copy-paste repository to quick start a new server in typescript

The repo supports stuff that is universal for every application

It supports login, signup, and viewing the frontend.

## How to add more functionality

In routes, controllers, and services add a new file meant for the new functionality

For example: Create a new file called post.ts supporting all post related actions.

### In routes/post.ts:

Copy with minimal changes to the skeleton code in routes/register.ts to be the new api calls,
and the controller to point to controllers/post.ts

### In controllers/post.ts:

Copy with minimal changes to the skeleton code in controllers/register.ts to pull out the data needed from the request,
to handle the new api requests (For example: take the username, text, and picture in the new post)

### In services/post.ts:

Copy with minimal changes to the skeleton code in services/register.ts to handle the request made by the user. <br/>
For example: save to mongodb the post made saving the date, text, image, and username.

### In app.ts:

Add a new app.use('...', [file_name]Router) line to tell the server to handle those request in this path.

### In models:

Add a new model that you want to save in the database (if you need)
For example: A new post model (Don't forget to change the user model accordingly)

### env changes:

Before runnning the code don't forget to change the env in: SECRET_ENC_KEY (To be random), SECRET_AUTH_KEY (To be random), CONNECTION_STRING (To have the project name in the end)
