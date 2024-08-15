# Chat Application

This is a real-time chat application built with Next.js, TypeScript, and Socket.IO. The application features JWT authentication and a chat interface that supports multiple users.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)

## Features

- User authentication with JWT
- Real-time messaging with Socket.IO
- Persistent chat history
- User-to-user private messaging
- Responsive UI with Bootstrap
- TypeScript support

## Technologies

- **Next.js**: Framework for server-rendered React applications.
- **TypeScript**: Type-safe JavaScript.
- **Socket.IO**: Real-time, bidirectional communication.
- **JWT**: JSON Web Tokens for secure authentication.
- **Bootstrap**: Responsive design framework.
- **Cypress**: End-to-end testing framework.

## Setup and Installation

### Prerequisites

- Node.js (>= 14.x)
- npm

### Installation

**1. Clone the repository:**

    git clone https://github.com/arunavaghsh84/tinman-chat-app.git
    cd tinman-chat-app

**2. Install dependencies:**

    npm install

**3. Set up environment variables:**

    touch .env.local

**Add the following environment variables:**

    BASE_URL=base_url
    JWT_SECRET=your_jwt_secret_key
    MONGO_URI=connection_uri

- BASE_URL: Adjust the base URL as necessary
- JWT_SECRET: Secret key for signing JWT tokens.
- MONGO_URI: Mongo Atlas connection string.

## Running the Application

### Development

To run the application in development mode:

    npm run dev

Visit http://localhost:3000 to view the application.

### Production

To build and run the application in production mode:

    npm run build
    npm run start

## Testing

End-to-end testing is set up using Cypress.

### Running Tests

To run Cypress tests:

    npm run cypress:open
