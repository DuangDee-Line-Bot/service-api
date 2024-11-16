# Service-API

- [Service-API](#service-api)
  - [Overview](#overview)
  - [End Points](#end-points)
  - [How to Start the Project](#how-to-start-the-project)
  - [Setup Credentials for Sending a Webhook and Managing LINE Official Account](#setup-credentials-for-sending-a-webhook-and-managing-line-official-account)
    - [Prerequisites](#prerequisites)
    - [1. Setting Up Webhook Credentials](#1-setting-up-webhook-credentials)
      - [Steps:](#steps)
    - [2. Configuring Admin and Client Credentials](#2-configuring-admin-and-client-credentials)
      - [Admin Credentials:](#admin-credentials)
      - [Client Credentials:](#client-credentials)
    - [3. Setting Up LINE Official Account](#3-setting-up-line-official-account)
      - [Steps:](#steps-1)

## Overview
...

## End Points

1. **Data Retrieval**
   - **Endpoint**: `/api/data`
   - **Description**: Serves data from a static JSON file (`data.json`).

2. **OTP Management**
   - **Endpoints**:
     - **GET /api/otp**: Retrieves all OTPs.
     - **GET /api/otp/{value}**: Retrieves a specific OTP by value.
     - **POST /api/otp**: Generates a new OTP.
     - **PATCH /api/otp/{value}**: Updates an existing OTP.
     - **DELETE /api/otp/{value}**: Deletes a specific OTP.
   - **Behavior**: OTPs expire after they are fetched, and a new OTP is automatically generated.

3. **Admin Webhook**
   - **Endpoint**: `/admin`
   - **Description**: Handles admin-specific webhook operations.

4. **Client Webhook**
   - **Endpoint**: `/client`
   - **Description**: Handles client-specific webhook


## How to Start the Project

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. **Install Dependencies**:

   ```bash
   make install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory of the project and configure the environment variables. You can use the `.env.example` file as a reference.

4. **Develop**
   ```bash
   make dev # dev
   # or
   make start # prod
   ```

---

## Setup Credentials for Sending a Webhook and Managing LINE Official Account

This guide outlines the steps to set up credentials for sending webhooks, configuring admin and client credentials, and managing the LINE Official Account settings.

### Prerequisites
- A LINE Developers account
- A LINE Official Account

### 1. Setting Up Webhook Credentials
To send webhooks, you need to create a channel and obtain credentials from the [LINE Developers Console](https://developers.line.biz/en/).

#### Steps:
1. Log in to the [LINE Developers Console](https://developers.line.biz/en/).
2. Create a new provider if you don’t already have one.
3. Click on "Create a Messaging API Channel" and provide the required information:
   - Channel name
   - Channel description
   - Email address
   - Terms of Use agreement
4. After the channel is created, note down the following credentials:
   - **Channel ID**
   - **Channel Secret**
   - **Channel Access Token** (Generate this from the console)

### 2. Configuring Admin and Client Credentials
To set up admin and client credentials:

#### Admin Credentials:
1. In the LINE Developers Console, navigate to your channel settings.
2. Under the "Messaging API" section, configure the webhook URL:
   - Enter the webhook endpoint (e.g., `https://yourserver.com/webhook`)
   - Enable the webhook by toggling the switch to "Enabled."
3. Use the **Channel Access Token** to authenticate requests from your server.

#### Client Credentials:
1. For client-side integration (e.g., LINE Login), configure the LINE Login settings:
   - Go to "LINE Login" in your channel settings.
   - Set the callback URL (e.g., `https://yourserver.com/callback`).
   - Obtain the **Client ID** and **Client Secret** for authentication.

### 3. Setting Up LINE Official Account
To customize your LINE Official Account name and policies for receiving messages, use the [LINE Official Account Manager](https://manager.line.biz/).

#### Steps:
1. Log in to the [LINE Official Account Manager](https://manager.line.biz/).
2. Select your account from the dashboard.
3. Configure the following settings:
   - **Account Name:** Update the name to match your branding.
   - **Messaging Policy:**
     - Enable or disable message reception based on your requirements.
     - Customize auto-reply messages if needed.
4. Test the account by sending and receiving messages.
