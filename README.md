# imgAuth
An implementation of the passpoints graphical user login strategy for GAWDS induction task

# Pass-Points
It is a graphical user authentication technique, where in the users are required to set particular permutation of points in the image provided as their password.
"Pass-Points" is different from the "Pass-Position" authentication technique, where in the password is the relative position of the points wrt each other (can be thought of like a pattern)

# Features in the app
- Login (the session persists for 5 minutes, i.e. the success route can be directly accessed after successful authentication for 5 minutes)
- Registration
- Changing Password for authenticated users
- Resetting forgotten password for unauthenticated users (a proper working email account is required for this)

# Directory Structure of the app
```
.
├── public
│   ├── css
│   ├── js
│   └── pages
└── src
    ├── config
    ├── controllers
    ├── routes
    ├── util
    └── views
```

# API Routes
- `/` is the homepage
- `/login` for login
- `/register` to register for a new account
- `/success` viewable after successful authentication
- `/forgot` to reset your forgotton password
- `/change` to update your password after authentication
 
# Running the app
1. Using `docker` and `docker-compose`
-   Edit the docker-compose.yml to add the required environment variables, after editing your docker-compose.yml should look something like
```version: '3.4'

services:
  imgauth:
    image: imgauth
    build:
      context: .
      dockerfile: ./Dockerfile
    environment:
      NODE_ENV: production
      JWT_SECRET: 'YOUR JWT SECRET'
      PORT : 'PORT OF YOUR CHOICE'
      SESSION_SECRET : 'YOUR EXPRESS SESSION SECRET'
      MAIL_SERVICE : "YOUR MAIL SERVICE"
      SERVICE_HOST : "YOUR EMAIL SERVICE HOST"
      SERVICE_USER : "YOUR EMAIL ID"
      SERVICE_PASS : "YOUR EMAIL PASSWORD"
      MAIL_FROM : "YOUR EMAIL"
    ports:
      - 8080:8080
```
- Now run the following commands

```shell
docker-compose build
docker-compose up
```

2. Using nodeJS
- Similar to the the above method, we first need to create a `.env` file in the `./src` folder, it will look something like
```
JWT_SECRET: 'YOUR JWT SECRET'
PORT : 'PORT OF YOUR CHOICE'
SESSION_SECRET : 'YOUR EXPRESS SESSION SECRET'
MAIL_SERVICE : "YOUR MAIL SERVICE"
SERVICE_HOST : "YOUR EMAIL SERVICE HOST"
SERVICE_USER : "YOUR EMAIL ID"
SERVICE_PASS : "YOUR EMAIL PASSWORD"
MAIL_FROM : "YOUR EMAIL"
```
- Now `cd` into the `./src` directory and run `npm install && npm start`, this will start up the app at the `PORT` specified by you.


# Features to be implemented
- Increasing the image db, as a single image is available to be used as a password specimen right now
- encrypting the passwords before storing in the db
- improving the frontend UI of the app
