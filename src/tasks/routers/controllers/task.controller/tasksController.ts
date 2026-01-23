import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/http-ststuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { mapToTasksOutputUtil } from '../../mappers/map-to-tasks-output.util';
import { TasksService } from '../../../application/tasks.service';
import { mapToTasksUpdateOutputUtil } from '../../mappers/map-to-tasks-update-output.util';

@injectable()
export class TasksController {
  constructor(
    @inject(TasksService) private tasksService: TasksService,
  ) {
  }

  async getUserTasks(
    req: Request<{ telegram_id: string }>,
    res: Response,
  ) {
    try {
      const tgId = req.params.telegram_id;
      const tasks = await this.tasksService.findMany(tgId);
      // console.log('getUserHandler tgId', tgId);
      const staticOutput = mapToTasksOutputUtil(tasks);
      res.status(HttpStatus.Ok).send(staticOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  // async postUserTask(
  //   req: Request<{ telegram_id: string }>,
  //   res: Response,
  // ) {
  //   try {
  //     const tgId = req.params.telegram_id;
  //     const form = await this.tasksService.addTaskToUser(tgId);
  //     // console.log('getUserHandler tgId', tgId);
  //     const staticOutput = mapToTasksOutputUtil(form);
  //     res.status(HttpStatus.Ok).send(staticOutput);
  //   } catch (e) {
  //     errorsHandler(e, res);
  //   }
  // }

  async updateUserTask(
    req: Request<{}, {}, { telegram_id: string, task_id: string, stat: number }>,
    res: Response,
  ) {
    try {
      const { telegram_id, task_id, stat } = req.body;
      console.log('getUserHandler req.body', req.body);
      const tasks = await this.tasksService.updateUserTask(telegram_id, task_id, stat);
      // console.log('getUserHandler tgId', tgId);
      if (!tasks) {
        res.status(HttpStatus.Ok).send({ resp: 'err', message: 'Error update status' });
        return;
      }
      const tasksOutput = mapToTasksUpdateOutputUtil(tasks, telegram_id);
      res.status(HttpStatus.Ok).send(tasksOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

}
