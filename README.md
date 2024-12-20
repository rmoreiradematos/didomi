# Project Name

## Description

This project is designed to manage events and users with a robust backend using Node.js, Prisma ORM, and a PostgreSQL database. It provides functionality to create, update, and retrieve users and events, ensuring comprehensive logging and validation. The project also supports unit and integration testing with Jest.

---

## Prerequisites

- **Node.js** (version 16 or higher recommended)
- **npm** (Node Package Manager)
- **Docker** (for running the database)
- **Prisma CLI** (bundled with the project dependencies)

---

## Installation and Setup

Follow these steps to get the project up and running:

### 1. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 2. Start the Database

Use Docker Compose to start the PostgreSQL database:

```bash
docker-compose up -d
```

### 3. Apply Migrations

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

### 4. Start the Application

Run the application in development mode:

```bash
npm run dev
```

### 5. Run Tests

To execute the test suite:

```bash
npm test
```

### To check test coverage:

```bash
npm run test:coverage
```

### Notes on Seed Data

Seed data has not been implemented for this project. The process is considered simple enough, and manually registering data allows for better validation of the system's behavior during testing and observation.

### Features

Event Management: Create and manage events tied to users.
User Management: Handle user creation and retrieval with validation.
