import { injectable } from 'inversify';
import { TaskDocument, TasksModel } from '../domain/task.model';


@injectable()
export class TasksQueryRepository {


  async getAllTasksByUser(tg_id: string): Promise<TaskDocument[]> {
    const tasks = await TasksModel
      .find({ tg_id })
      .sort({ user_stat: 1, id: 1 })
      .exec();

    return tasks;
  }
}
