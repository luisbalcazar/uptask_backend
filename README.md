## UpTask (Backend | In Development)

Web application for project managing, allowing users to create, edit, and manage projects and adding tasks.

## Tech Stack

- Backend: Node.js / Express
- Database: MongoDB
- ORM/ODM: Mongoose

## Features

- REST API development with Express
- CRUD operations using Mongoose and MongoDB
- Request validation using Express Validator
- Middleware-based architecture

## Project Structure

```
/src → Application source code
/config → Database and Cors configuration
/controllers → Application controller handlers
/models → Database models (Mongoose)
/middlewares → Custom middlewares
/routes → Application route endpoints (Express, Express Validator)
/services → Integration and consume of database models CRUD functions (Mongoose)
```

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/luisbalcazar/uptask_backend.git

# Install dependencies
npm install

# Run project
npm run dev
```

## Technical Highlights

- Implementation of RESTful API with Express
- Database integration using Mongoose ODM
- Input validation and middleware handling

## Future Improvements

- Implement user authentication
- Add testing
- Add API documentation (Swagger)
