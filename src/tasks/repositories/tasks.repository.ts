import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';

import { userCollection } from '../../db/db';
import { injectable } from 'inversify';
import { TaskDocument, TasksModel } from '../domain/task.model';
import { UserModel } from '../../users/domain/user.model';
import { Task } from '../application/dtos/task.attributes';

export type TasksItemType = {
  id: number;
  title: string;
  amount: number;
  link: string;
  icon: string;
  img: string;
  stat: number;
  user_stat: number;
  dt_create: string;
};


@injectable()
export class TasksRepository {

  async insertMany(tg_id: string, tasks: TasksItemType[]) {
    if (!tasks.length) return;

    await TasksModel.insertMany(
      tasks.map((task) => ({
        ...task,
        tg_id,
      })),
    );
  }

  async addTask(tg_id: string, task: TasksItemType) {
    await TasksModel.create({
      ...task,
      tg_id,
    });
  }

  async updateTask(tg_id: string, task_id: string, stat: number): Promise<TaskDocument | null> {
    const task = await TasksModel.findOne({ tg_id, _id: task_id });
    if (!task) {
      return null;
    }
    // обновляем статус таски
    task.user_stat = stat;

    // если claim (3), начисляем amount пользователю
    if (stat === 3) {
      await UserModel.updateOne(
        { tg_id },
        { $inc: { amount: task.amount } },
      );
      task.dt_done = new Date().toISOString();
    }

    if (stat === 2) {
      task.dt_start = new Date().toISOString();
    }

    return await task.save();
  }
}
