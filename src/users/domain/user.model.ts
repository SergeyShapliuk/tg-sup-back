import mongoose, { HydratedDocument, Model } from 'mongoose';
import { USERS_COLLECTION_NAME } from '../../db/db';


/* =======================
   Types
======================= */

// export type Donuts = {
//   current_amount: string;
//   purpose_amount: string;
//   currency: string;
// };

export interface User {
  tg_id: string;
  tg_firstname: string;
  tg_lastname: string;
  tg_nick: string;
  tg_language: string;

  created_at: string;
  updated_at: string;

  amount: number;
  time_end: number;
  time_start: number;
  timer_active: boolean;
  // photos: any[];

  // donuts: Donuts;
  // hashtags: { [key: string]: string[] };
}

type UserModel = Model<User>;
export type UserDocument = HydratedDocument<User>;

/* =======================
   Sub Schemas
======================= */

// Donuts
// const donutsSchema = new mongoose.Schema<Donuts>(
//   {
//     current_amount: { type: String, default: '0' },
//     purpose_amount: { type: String, default: '0' },
//     currency: { type: String, default: 'USD' },
//   },
//   { _id: false },
// );

/* =======================
   Main User Schema
======================= */

const UserSchema = new mongoose.Schema<User>({
  tg_id: { type: String, required: true, unique: true },
  tg_firstname: { type: String, default: '' },
  tg_lastname: { type: String, default: '' },
  tg_nick: { type: String, default: '' },
  tg_language: { type: String, default: 'en' },

  created_at: { type: String, default: () => new Date().toISOString() },
  updated_at: { type: String, default: () => new Date().toISOString() },

  amount: { type: Number, default: 0 },
  time_end: { type: Number, default: 0 },
  time_start: { type: Number, default: 0 },
  timer_active: { type: Boolean, default: false },

  // name: { type: String, default: '' },
  // wallet: { type: String, default: '' },
  // description: { type: String, default: '' },
  // photos: { type: [String], default: [] },

  // donuts: {
  //   type: donutsSchema,
  //   default: () => ({
  //     current_amount: '0',
  //     purpose_amount: '0',
  //     currency: 'USD',
  //   }),
  // },
  //
  // hashtags: {
  //   type: Map,
  //   of: [String],
  //   default: {},
  // },
});

/* =======================
   Model
======================= */
UserSchema.index({ time_end: 1, timer_active: 1 });

export const UserModel = mongoose.model<User, UserModel>(
  USERS_COLLECTION_NAME,
  UserSchema,
);
