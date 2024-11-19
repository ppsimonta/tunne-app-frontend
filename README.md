# Tunne-app web front-end

React front-end for use with the [Tunne-app backend](https://github.com/ppsimonta/tunne-app-backend).

## Installation

Prerequisites:

- Git
- NodeJS (if not using Docker)
- Docker (optional)

### Clone the repository:

```sh
git clone https://peke.plab.fi/frostbit-web/tunne-app-frontend.git
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