import { MongoClient } from 'mongodb';

let db;

export async function connectMongo() {
  console.log('MONGODB_URL:', process.env.MONGODB_URL);
  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  db = client.db('vite-gourmand');
  console.log('🍃 MongoDB: Connectée');
}

export function getMongo() {
  if (!db) throw new Error('MongoDB non connectée');
  return db;
}