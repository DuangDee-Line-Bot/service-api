# Service-API

- [Service-API](#service-api)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [How to Start the Project](#how-to-start-the-project)

This project is a simple Node.js API that provides two key functionalities:

1. **Data Retrieval**: Serve data from a static JSON file through an API.
2. **OTP Generation**: Generate a One-Time Password (OTP) which expires after it is fetched and then automatically regenerates a new one.

The API is built using Express.js and supports configurable environment variables.

## Features

- **GET /api/data**: Retrieves data from a static JSON file (`data.json`).
- **GET /api/otp**: Generates a new OTP that expires after it's fetched and regenerates automatically.

## Prerequisites

Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).

## How to Start the Project

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd service-api
   ```

2. **Install Dependencies**:

   ```bash
    npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory of the project and configure the environment variables. You can use the `.env.example` file as a reference.

   **Example .env file:**

   ```bash
   PORT=8080 # Port the server will run on
   OTP_LENGTH=5 # Length of the generated OTP
   OTP_EXPIRY=180000 # OTP expiry time in milliseconds (3 minutes)
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   or

   ```bash
   yarn start
   ```
