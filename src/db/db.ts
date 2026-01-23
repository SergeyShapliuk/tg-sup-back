import { Collection, Db, MongoClient } from 'mongodb';

import { SETTINGS } from '../core/settings/settings';
import { User } from '../users/domain/user.model';
import * as mongoose from 'mongoose';
import { Task } from '../tasks/application/dtos/task.attributes';

export const USERS_COLLECTION_NAME = 'users';
export const TASKS_COLLECTION_NAME = 'tasks';


export let client: MongoClient;
// export let videoCollection: Collection<Video>;
export let userCollection: Collection<User>;
// export let tokenBlacklistCollection: Collection<BlacklistedToken>;
export let tasksCollection: Collection<Task>;


// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  // Инициализация коллекций
  // videoCollection = db.collection<Video>(VIDEOS_COLLECTION_NAME);
  userCollection = db.collection<User>(USERS_COLLECTION_NAME);
  tasksCollection = db.collection<Task>(TASKS_COLLECTION_NAME);
  // await ensureTTLIndex();
  // await ensureDevicesTTLIndex();
  // await postLikeCollection.dropIndex("userId_1_commentId_1")

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
    await mongoose.connect(url);
    console.log('✅ Connected to the mongoose');
  } catch (e) {
    await client.close();
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}


// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}

