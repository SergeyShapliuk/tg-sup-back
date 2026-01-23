import { inject, injectable } from 'inversify';
import { TasksItemType, TasksRepository } from '../repositories/tasks.repository';
import { TasksQueryRepository } from '../repositories/tasks.query.repository';
import { TaskDocument } from '../domain/task.model';
import { WithId } from 'mongodb';
import { Task } from './dtos/task.attributes';


@injectable()
export class TasksService {
  constructor(
    @inject(TasksRepository) private tasksRepository: TasksRepository,
    @inject(TasksQueryRepository) private tasksQwRepository: TasksQueryRepository,
  ) {
  }

  async findMany(
    tg_id: string,
  ): Promise<WithId<Task>[]> {
    return this.tasksQwRepository.getAllTasksByUser(tg_id);
  }

  async addTaskToUser(tg_id: string, task: TasksItemType) {
    await this.tasksRepository.addTask(tg_id, {
      ...task,
      dt_create: new Date().toISOString(),
    });
  }

  async updateUserTask(tg_id: string, task_id: string, stat: number): Promise<TaskDocument | null> {
    return this.tasksRepository.updateTask(tg_id, task_id, stat);
  }


}

