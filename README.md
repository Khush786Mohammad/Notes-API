# Notes API

A full-stack notes application. Users can register and sign in, then create, edit, search, sort, paginate, and delete their own notes.

- **Backend:** Spring Boot REST API with JWT authentication and MySQL
- **Frontend:** Angular single-page application that consumes the API

## Features

- User registration and login
- JWT-based authentication with BCrypt password hashing
- User ownership and authorization (users only access their own notes)
- Create, read, update, delete and search notes
- Pagination, sorting, and searching
- Request validation and global exception handling
- DTO-based request/response models
- Swagger / OpenAPI documentation
- Angular UI with route guards, HTTP interceptors, and confirmation dialogs

## Tech Stack

| Layer    | Technologies                                                                  |
| -------- | ----------------------------------------------------------------------------- |
| Backend  | Java, Spring Boot 4.x, Spring Security, JWT, Spring Data JPA / Hibernate, MySQL, Maven, Swagger / OpenAPI, SLF4J |
| Frontend | Angular, TypeScript, npm                                                      |

## Prerequisites

- Java 17+
- Maven 3.8+ (or use the included `./mvnw`)
- MySQL
- Node.js and npm

## Project Structure

```text
note-api/
├── backend/                  # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com.khush.notes_api/
│   │   │   │   ├── advice/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exceptions/
│   │   │   │   ├── filters/
│   │   │   │   ├── mapper/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/java/
│   └── pom.xml
├── frontend/                 # Angular application
│   ├── public/assets/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # auth, navbar, notes, pagination, etc.
│   │   │   ├── dialogs/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── model/
│   │   │   └── services/
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

> Adjust the `backend/` and `frontend/` folder names above to match your repository.

## Getting Started

Start the backend first, then the frontend.

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API starts by default at:

```text
http://localhost:8080/notes-api/v1
```

Other backend commands:

```bash
./mvnw clean install   # build
./mvnw test            # run tests
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The development server reloads when application files change.

Other frontend commands:

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm start`     | Start the development server                     |
| `npm run build` | Create a production build (output in `dist/`)    |
| `npm run watch` | Build in development mode and rebuild on changes |
| `npm test`      | Run unit tests                                   |

## Configuration

### Backend

Configuration lives in `backend/src/main/resources/application.properties`.

Example:

```properties
spring.application.name=notes-api
server.port=8080
server.servlet.context-path=/notes-api/v1

spring.datasource.url=jdbc:mysql://localhost:3306/notesDB
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.security.jwt.securitykey=your_256_bit_secret
spring.security.expiration_time=your_expiration_time
```

### Frontend

The API base URL and context path are configured in the environment files:

- `frontend/src/environments/environment.development.ts` is used by `npm start`.
- `frontend/src/environments/environment.ts` is used by the production build.

Both currently point to `http://localhost:8080` with the context path `/notes-api/v1`. Update these values to match your backend deployment.

The application stores the authentication token in browser local storage and uses it for authenticated requests. The session duration is also set in the environment files (60 minutes by default).

## API Documentation

Swagger UI:

```text
http://localhost:8080/notes-api/v1/swagger-ui/index.html
```

OpenAPI specification:

```text
http://localhost:8080/notes-api/v1/v3/api-docs
```

The API uses JWT Bearer authentication. Use Swagger's **Authorize** button and provide a valid JWT before calling secured endpoints.

## Authentication

Register with `POST /auth/register`, then sign in with `POST /auth/login` to receive a JWT. Send the token with every secured request:

```http
Authorization: Bearer <JWT>
```

## API Endpoints

### Authentication

| Method | Endpoint         | Auth   | Description                    |
| ------ | ---------------- | ------ | ------------------------------ |
| POST   | `/auth/register` | Public | Register a new user            |
| POST   | `/auth/login`    | Public | Authenticate and receive a JWT |

### Profile

| Method | Endpoint      | Auth | Description                   |
| ------ | ------------- | ---- | ----------------------------- |
| POST   | `/profile/me` | JWT  | Get the current user's profile |

### Notes

| Method | Endpoint             | Auth | Description                                       |
| ------ | -------------------- | ---- | ------------------------------------------------- |
| GET    | `/user/notes`        | JWT  | Get the authenticated user's notes (paginated)    |
| GET    | `/user/notes/search` | JWT  | Search the authenticated user's notes (paginated) |
| POST   | `/user/notes`        | JWT  | Create a note for the authenticated user          |
| PUT    | `/user/notes`        | JWT  | Update one of the authenticated user's notes      |
| DELETE | `/user/notes/{id}`   | JWT  | Delete one of the authenticated user's notes      |

### Pagination, sorting and searching

The list and search endpoints support page number, page size, sort field, and sort order parameters:

```text
GET /user/notes?pageNo=0&pageSize=1&sortField=title&order=asc
```

Both endpoints return the authenticated user's notes as a paginated response.

## Authorization Model

Each note belongs to one user. A user cannot read, update, or delete another user's notes. Note lookup also considers the authenticated user's ID, so an inaccessible note is treated as not found rather than revealing ownership information.

## Database

The application uses MySQL with JPA/Hibernate.

```text
User 1 ─────────── * Notes
```

A user can have multiple notes, while each note belongs to one user.

## Backend Design Notes

- **DTOs:** Request and response payloads use DTOs instead of exposing JPA entities. This keeps responses clean and avoids recursive JSON serialization from the bidirectional `User` ↔ `Notes` relationship.
- **Error handling:** A global exception handler returns appropriate HTTP status codes for invalid requests, authentication failures, unauthorized access, and missing resources.
- **Logging:** Events and errors are logged with SLF4J instead of `System.out.println()`.
- **Security:** Spring Security with `DaoAuthenticationProvider`, a custom `UserDetailsService`, BCrypt password encoding, a custom JWT filter, stateless sessions, and the `SecurityContext` for authenticated-user information. Authentication and Swagger/OpenAPI resources are public; all other endpoints require a valid JWT.

## Future / Optional Features

- Login using username or email
- JWT logout / token invalidation strategy
- Refresh tokens
- Role-based authorization
- Password change/reset
- Email verification
