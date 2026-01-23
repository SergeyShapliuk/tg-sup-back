import mongoose, { Model, HydratedDocument } from 'mongoose';
import { TASKS_COLLECTION_NAME } from '../../db/db';
import { Task } from '../application/dtos/task.attributes';

export interface TaskModelType extends Task {
}


export type TaskDocument = HydratedDocument<TaskModelType>;

type TaskModel = Model<TaskModelType>;

const TasksSchema = new mongoose.Schema<Task>(
  {
    tg_id: { type: String, required: true, index: true },

    // id: { type: Number, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },

    link: { type: String, default: '' },
    icon: { type: String, default: '' },
    img: { type: String, default: '' },

    stat: { type: Number, default: 1 },
    user_stat: { type: Number, default: 1 },

    dt_create: {
      type: String,
      default: () => new Date().toISOString(),
    },
    dt_start: String,
    dt_done: String,
  },
  {
    versionKey: false,
  },
);

// 🔐 защита от дубликатов таски для юзера
TasksSchema.index({ tg_id: 1, title: 1 }, { unique: true });

export const TasksModel = mongoose.model<Task, TaskModel>(
  TASKS_COLLECTION_NAME,
  TasksSchema,
);
