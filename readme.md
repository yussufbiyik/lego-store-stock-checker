# Lego Store Stock Checker
This project is made to check the stock of Lego Store Turkey, it offers two modes:
1. CLI mode, which works by looking for keychains that are given as arguments when starting the project.
2. Server mode, which works by checking keychains and sending push notifications using webpush to subscribers which are registered using `/subscribe` endpoint and being stored in an sqlite database.

## Tech Stack
[![Tech Stack](https://skillicons.dev/icons?i=nodejs,express,sqlite)](https://skillicons.dev)

### Flowchart
```mermaid
graph TD;
    A[Start] --> B{Are there any given arguments on start?}
    subgraph CLI Mode
    B --> |Yes| C[[Get keychain codes from arguments]]
    C --> D[Check Lego Store Turkey]
    D --> L[Print the output]
    L --> M[End]
    end
    subgraph Server Mode
    B --> |No, start the server| E[Server]
    subgraph Subscriber-Server Interactions
    F[Subscriber] --> |/subscribe| E
    F --> |/check| E
    E --> |/subscribe| I[(Database)]
    E --> |/check| J
    J --> |/check response| F
    end
    subgraph CRON Job
    E --> G[Wait for the scheduled cron job to begin]
    G --> J[Get keychain codes from subscribers' watchlists]
    I --> |getSubscribers| J
    J --> N[Check Lego Store Turkey]
    N --> K[Iterate through subscribers and send notifications to each that are looking for a product on the list]
    K --> G
    end
    end
```
### Server and Subscriber Interaction
```mermaid
sequenceDiagram
    actor Subscriber
    Note over Subscriber,Server: Register Page
    Subscriber->>+Server: /
    Server-->>Subscriber: Register Page
    Note over Subscriber,Server: Subscribe
    Subscriber->>+Server: /subscribe
    Server-->>Subscriber: 200, Added subscriber
    Note over Subscriber,Server: Look through a watchlist on request
    Subscriber->>+Server: /check
    Server-->>Subscriber: Result(JSON)
```

## Features
- [CLI Mode](https://github.com/yussufbiyik/lego-store-stock-checker?tab=readme-ov-file#using-cli)
- [Server Mode](https://github.com/yussufbiyik/lego-store-stock-checker?tab=readme-ov-file#using-as-a-server)
    - Scheduled cron jobs to check the stock in regular intervals
        - Sending push notifications if a product is in stock
    - Multiple subscriber support
        - Safe password storage & Authentication

## Setup
1. Clone or download the project.
2. Open the project directory in terminal.
3. Run `npm install` command and download the project dependencies.
4. Only required for server mode, create a file named `.env`, this will store our secrets.

### Creating VAPID Keys
Run
```bash
$ npm run createVAPID
```
command on terminal save the response, the `PUBLIC_VAPID_KEY` and `PRIVATE_VAPID_KEY` values in `.env` comes from here.

### Creating .env File
```env
# WEBPUSH CONFIG
PUBLIC_VAPID_KEY="Public VAPID Key" 
PRIVATE_VAPID_KEY="Private VAPID Key"
MAIL="Your E-Mail"
# JWT CONFIG
TOKEN_SECRET="Random secret code that should not be shared, type whateveer you want to."
# SERVER CONFIG
PORT=3000
# Interval of the CRON Job
CRON_INTERVAL = "0 */4 * * *"
```
Change all the values.

## Using as a Server
Watchlist is constructed by itrating over all subscribers and pushing their watchlist to an array and flattening it later.

The way the cron job is scheduled is assigned to CRON_INTERVAL in the `.env` file, [Refer](https://www.npmjs.com/package/node-cron#cron-syntax) to here to change the interval as you wish.
Default is once every 4 hours. 

Run
```bash
$ npm start
``` 
command on terminal to start the server.

### Registering to the Server
You'll be greeted by the register page if you visit `localhost:PORT`*, you can register with any username and password and make sure to fill the form with your watchlist.

*: PORT, is determined in `.env` file, default is 3000

## Using CLI
If you don't want to run scheduled checks, just use it in the following format (pass 0 as keychain code to get all the keychains):
```bash
$ npm start <KEYCHAIN_CODE> <KEYCHAIN_CODE>
``` 

## LISENCE
ISC

## TODOs
- [X] Send push notifications when a product is in stock
- [X] Add multiple user support with JWT
- [X] Hide juicy data from public using dotenv
- [ ] Running on firebase?
- [X] Update readme.md with more details

## Screenshots
![Her ürünü kontrol ederse.](screenshots/cli.png)
![Sunucu tarafından ekran görüntüsü.](screenshots/serverside.png)
