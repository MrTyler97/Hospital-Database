Backend Installations:
npm init -y
npm install express mysql2 dotenv cors:

    express - web framework that works with node.js(server enviorment). Basically, makes complcated things easier.
    mysql2 - Node.js module that provide a interface for interacting with mysql databases
    dotenv - node.js module that allows us to manage enviorment variables. EV - kye-value pairs, api keys, database connections.
    cors - CORS is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the web page.

npm install --save-dev typescript ts-node-dev @types/express @types/node @types/cors
npx tsc --init

Frontend Installations:
npx create-react-app frontend --template typescript:

    create-react-app frontend - Sets up a complete React project structure with all necessary dependencies and configurations. Basically, creates a template thats ready to go.
    --template typescript - This flag tells create-react-app to use the TypeScript template instead of the default JavaScript template.

npm install axios:
Axios - Makes it easier to perform HTTP requests to interact with APIs.

npm install react-router-dom @types/react-router-dom

- Switching between pages Login and Dashboard
