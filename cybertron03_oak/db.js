// import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts"
import { MongoClient } from "npm:mongodb"

// const client = new MongoClient();
// client.connectWithUri("mongodb://localhost:27017");
// const client = new MongoClient("mongodb://localhost:27017");
const client = new MongoClient("mongodb://127.0.0.1:27017");

// export const db = client.database("cybertronians");
export const db = client.db("cybertronians");

export const autobots = await db.collection("autobots");
export const decepticons = await db.collection("decepticons");
export const primes = await db.collection("primes");