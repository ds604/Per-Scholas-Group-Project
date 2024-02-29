// import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts";
import { MongoClient } from "npm:mongodb"

// const client = new MongoClient();
// client.connectWithUri("mongodb://localhost:27017");
const client = new MongoClient("mongodb://localhost:27017");

// list databases
// await client.db().admin().listDatabases()

// list collections in "test"
//await client.db("test").listCollections().toArray()

// get db, get collections
// let testDb = await client.db("test")
// await testDb.collections()

// list items in a collection
// await testDb.collection("towns").find().toArray()
// await client.db("test").collection("towns").find().toArray()


// Modify Deno Mongo client to NPM Mongo
// const db = client.database("cybertronians");
const db = client.db("cybertronians");

const autobots = db.collection("autobots");
const decepticons = db.collection("decepticons");


const insertDecepticon = await decepticons.insertOne({
    name : "Starscream",
})

const insertAutobot = await autobots.insertMany([
    { name : "Bumblebee" },
    { name : "Ironhide" },
])

console.log(await autobots.find().toArray())
console.log(await decepticons.find().toArray())