# plastic-bank

To Run - 
npm i jest --save-dev
npm i nodemon --save-dev
npm i body-parser --save
npm i cross-env --save
npm i crypto-js --save
npm i elliptic --save
npm i express --save
npm i hex-to-binary --save
npm i parcel-bundler --save
npm i react --save
npm i react-dom --save
npm i redis --save
npm i request --save
npm i uuid4 --save
npm i ws --save
npm i react-bootstrap --save
npm i react-router-dom --save
npm i history --save
npm i body-parser --save
npm i express
npm i nodemon --save-dev
npm i crypto-js --save 
npm i jest --save-dev  
npm i ws --save
npm i elliptic --save
npm i uuid --save
npm i uuid4 --save
npm i request --save
npm i parcel-bundler --save
npm i react-bootstrap --save
npm i babel-core babel-plugin-transform-class-properties babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react --save
npm i react react-dom --save
npm i react --save
npm i cross-env --save
sudo apt-add-repository ppa:redislabs/redis
sudo apt-get install redis-server
npm i history --save
npm install truffle -g
npm install web3 solc
npm install --save-dev @babel/core


{
  "name": "pb_capstone",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest --watchAll",
    "start": "npm run build-client && node index.js",
    "dev": "npm run dev-client & npm run start-redis && nodemon index.js",
    "dev-peer": "npm run dev-client & cross-env GENERATE_PEER_PORT='true' nodemon index.js",
    "start-redis": "redis-server --daemonize yes",
    "build-client": "npm run clean && parcel build client/src/index1.html --out-dir client/dist",
    "dev-client": "npm run clean && parcel client/src/index1.html --out-dir client/dist",
    "clean": "rm -rf .cache client/dist"
  },
  "jest": {
    "testEnvironment": "node"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "jest": "^27.1.1",
    "nodemon": "^2.0.12"
  },
  "dependencies": {
    "@babel/core": "^7.15.8",
    "babel-core": "^6.26.3",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "body-parser": "^1.19.0",
    "cross-env": "^7.0.3",
    "crypto-js": "^4.1.1",
    "elliptic": "^6.5.4",
    "express": "^4.17.1",
    "graphql-tools": "^8.2.0",
    "hex-to-binary": "^1.0.1",
    "history": "^5.0.1",
    "mysql": "^2.18.1",
    "parcel-bundler": "^1.12.5",
    "react": "^17.0.2",
    "react-bootstrap": "^1.6.3",
    "react-dom": "^17.0.2",
    "react-router-dom": "^5.3.0",
    "redis": "^3.1.2",
    "request": "^2.88.2",
    "solc": "^0.8.7-fixed",
    "truffle": "^5.4.10",
    "uuid4": "^2.0.2",
    "web3": "^1.5.2",
    "ws": "^8.2.2"
  }
}
