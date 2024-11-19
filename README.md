# Tunne-app web front-end

React front-end for use with the [Tunne-app backend](https://github.com/ppsimonta/tunne-app-backend).

This repository contains the frontend application for the **Tunne App**, a platform designed to help users track and analyze their emotional well-being through various interactive features, such as surveys, instances, and real-time data visualizations.

## Features

- **User Authentication**: Users can log in and customize their preferences for themes and notifications.
- **Survey Management**: Users can fill out surveys related to their emotional well-being.
- **Instance Management**: Create, edit, and view instances, which include questions and analytics.
- **Real-Time Visualization**: Real-time tracking of user data (e.g., body metrics, mood).
- **Analytics Dashboard**: Provides insights and data visualizations on user’s emotional state over time.
- **Markdown Pages**: Privacy policy and other informational pages presented in markdown format.

## Frontend Overview

### **Pages & Routes**

- **Home Page**: The landing page with an overview and navigation to other sections.
- **Dashboard**: Displays user-specific information and insights on their emotional well-being.
- **Instance Pages**: Specific pages for creating, editing, and analyzing instances related to surveys.
- **Survey Page**: Where users can fill out emotional well-being surveys.
- **Analytics Page**: Displays charts and insights based on user data.
- **Markdown Pages**: Privacy policy and other markdown-based content.
- **Real-Time Pages**:
  - **Body Real-Time**: Displays real-time body metrics visualization.
  - **Full Screen Bubble View**: Shows real-time mood data in an interactive, full-screen view.
  
### **Components**

- **NavBar**: The navigation bar that allows users to move between pages.
- **SmileyFaces**: A component that visualizes emotional states with smiley faces.
- **CreateInstance**: Allows users to create a new instance with custom questions.
- **ColorPicker**: Enables users to select a color for their instance or survey.
- **QuestionEditView**: Allows users to edit questions in an instance.
- **SocketIoTest**: A component used for testing real-time features.
- **StartingInfo**: A component showing introductory or welcome information when the user is not viewing sensitive pages like the privacy policy.
  
### **State Management**

The application uses **React Context API** for managing user-specific preferences and authentication data. The `UserContext` provides information about user preferences, including theme settings, which are applied dynamically throughout the app.

### **Real-Time Updates**

Real-time features are powered by **Socket.IO** to provide live updates and interaction for users. This is used in components like **BodyRealTime** and **FullScreenBubbleView**, where users can track their metrics and mood live.

### **API Integration**

- **React Router**: Manages navigation between pages in the app.
- **Axios**: Axios is used for making API requests to interact with the backend (e.g., fetching instance data, surveys, and analytics).
- The app integrates with various backend APIs for managing surveys, instances, user data, and real-time interactions.

## Tech Stack

- **React**: JavaScript library for building user interfaces.
- **Material-UI**: For UI components such as the Navbar and color themes.
- **React Router**: For managing page navigation.
- **Axios**: HTTP client for communicating with the backend API.
- **Socket.IO**: For real-time updates and communication.
- **Markdown**: For rendering privacy policy and other markdown content.
- **i18n (Internationalization)**: To support multiple languages for a broader user base.
- **CSS**: For general styling.

## Installation

Prerequisites:

- Git
- NodeJS (if not using Docker)
- Docker (optional)

### Clone the repository:

```sh
git clone https://github.com/ppsimonta/tunne-app-frontend.git
cd tunne-app-frontend
```

### Set the back-end URL:

1.  If running with NodeJS
    
    Rename the `.env.example` file to `.env` and fill in the values.

2.  If using Docker

    Edit the values `docker-compose.yml` file where it says `args`.

## Running the app

You can either build and serve the static files or use Docker with the provided Dockerfile.

1.  Build and serve using the NodeJS preview server
    ```sh
    npm install
    npm run build
    npm run preview
    ```

    By default the port is set to 4173.

2.  Run using docker
    ```sh
    docker-compose up --build
    ```

    The port can be changed by editing the `docker-compose.yml` file where it says `ports` and setting the value right of the colon to the desired port number.
