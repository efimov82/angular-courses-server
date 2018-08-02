# angular-courses-server
REST server for Angular-course

## Development server

Copy file .env.default to .env

Run
```
sudo docker-compose up
```

Server API:

Registration:
POST localhost:3000/auth/signup
Params:
- email
- password

Sign-In
localhost:3000/auth/login
Params
- email
- password

List of Courses
GET http://localhost:3000/courses

