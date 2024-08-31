const { createServer } = require("http");
const { readFileSync } = require("fs");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fcwam-admin:Vnh4xrqJf4xBsfZM@cluster0.x0yir.gcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main();

async function main() {
  const collection = await connectToMongo();

  runServer(5500, collection);
}

async function addItem(collection, name) {
  const item = { name };

  await collection.insertOne(item);
}

async function getItems(collection) {
  return collection.find().toArray();
}

async function connectToMongo() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();

  const collection = client.db("fcwam-db").collection("list");

  return collection;
}

function runServer(port, collection) {
  const server = createServer();

  server.listen(port, () => console.log('http://localhost:' + port));

  server.on('request', handleRequest(collection));
}

function handleRequest(collection) {
  return async function (request, response) {
    if (request.url === '/new') {
      const body = await getBody(request);
      const name = body.split('=')[1];
      
      await addItem(collection, name);
  
      const items = await getItems(collection);

      response.end(JSON.stringify(items));

      return;
    }
      
    if (request.url === '/items') {
      const items = await getItems(collection);

      response.end(JSON.stringify(items));

      return;
    }

    try {
      const path = '.' + request.url;
      const html = readFileSync(path);

      response.end(html);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end('File not found' + request.url);
    }
  }
}

async function getBody(request) {
  let body = '';
  
  for await (const chunk of request) body += chunk;

  return body;
}

//!    Frontend  <->  Backend  <->  Database
//!    client  <->  server/client  <->  server

/*
nodejs builtin modules:

http
fs

npm modules:

mongodb
*/

//* SSR - Server Side Rendering
//* CSR - Client Side Rendering

//? CRUD - Create, Read, Update, Delete
