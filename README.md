# Project Name
rumbo-al-altar-back

## Description

This server-side application provides backend functionality for the "Rumbo al altar" wedding platform. It handles user authentication, registration, attendee management, image uploading, and wedding details retrieval and updates.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Project Structure](#project-structure)

## Installation

To install and run this project on your local machine, follow these steps:

1. Clone this repository on your local machine using Git:
git clone https://github.com/r-bh/rumbo-al-altar-back.git

2. Navigate to the project directory:
cd rumbo-al-altar-back

3. Install project dependencies using npm:
npm install

## Usage

To start the server, run the following command:
npm start

## Endpoints

### Login

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Logs in a user with provided username and password.
- **Parameters:** `name` (username), `password` (password)
- **Response:** User object if successful, error message if credentials are incorrect.

### Register

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Registers a new admin and guests user for a wedding.
- **Parameters:** `adminUserName`, `adminPassword`, `guestsUserName`, `guestsPassword`
- **Response:** Success message if registration is successful, error message if username already exists.

### Get All Attendees

- **URL:** `/attendees`
- **Method:** `GET`
- **Description:** Retrieves all attendees registered for a wedding.
- **Response:** Array of attendee objects.

### Add Attendee

- **URL:** `/attendees/:weddingId`
- **Method:** `POST`
- **Description:** Adds a new attendee to a wedding.
- **Parameters:** `name`, `email`, `mealPreference`, `busPreference`, `comments`
- **Response:** Newly added attendee object.

### Delete Attendee

- **URL:** `/attendees/:email`
- **Method:** `DELETE`
- **Description:** Deletes an attendee from a wedding.
- **Parameters:** `email` (attendee's email address)
- **Response:** Deleted attendee object.

### Upload Image

- **URL:** `/upload`
- **Method:** `POST`
- **Description:** Uploads an image to the server.
- **Parameters:** `file` (image file)
- **Response:** Object containing the image path.

### Update Wedding

- **URL:** `/wedding/:id`
- **Method:** `PUT`
- **Description:** Updates wedding details.
- **Parameters:** `id` (wedding ID), request body with updated wedding details.
- **Response:** Updated wedding object.

### Get Wedding

- **URL:** `/wedding/:id`
- **Method:** `GET`
- **Description:** Retrieves wedding details.
- **Parameters:** `id` (wedding ID)
- **Response:** Wedding object.

## Project Structure

The project structure is as follows:

- **server.js:** Main server file containing the backend logic.
- **images:** Folder containing uploaded images.
- **models:** Folder containing database schema definitions.
