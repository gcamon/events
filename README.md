EVENT APPLICATION
App Details
1) Project Name: Event Application
2) DB Name: eventsDB
3) Language Used: Javascript (Node.js)
4) Database Used: MongoDB
5) Local Server Used: Node.js

App Deployment
1) Install Node.js (v10.12.0) and MongoDB ( v3.4.7 ) servers.
2) Clone the app from the Github repository ( https://github.com/gcamon/events.git ), navigate to the directory of the cloned app and run 'npm install' to install all dependencies.
3) Start your mongodb database from command line. eg "mongod --dbpath path/to/where/file-data-is-writen". For me on terminal it is "mongod --dbpath 'c:/mongodb/data/db'"
4) Run "npm start server.js" to start the node.js server. 
5) On browser visit "localhost:3004" to view the running app.
6) Go to sign up and create an account as admin. The admin is set true in the db by default for testing purposes. But i reality, it should be set to false and updated when desired.
7) Log in as admin and create/add events types.
8) Go inside different event types you created and add your events.

