import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { container } from '../../composition-root';
import { TasksController } from './controllers/task.controller/tasksController';
import { tgIdValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { userUpdateTaskValidation } from './task.input-dto.validation-middlewares';

export const tasksRouter = Router({});

const tasksController = container.get<TasksController>(TasksController);

// timersRouter.use(superAdminGuardMiddleware);

tasksRouter
  .get(
    '/:telegram_id',
    tgIdValidation,
    inputValidationResultMiddleware,
    tasksController.getUserTasks.bind(tasksController),
  )

  // .post(
  //   '',
  //   inputValidationResultMiddleware,
  //   tasksController.postUserTask.bind(tasksController),
  // )

  .post(
    '/status',
    ...userUpdateTaskValidation,
    inputValidationResultMiddleware,
    tasksController.updateUserTask.bind(tasksController),
  );


// .post(
//   '',
//   userCreateInputValidation,
//   inputValidationResultMiddleware,
//   usersController.createUserHandler.bind(usersController),
// )
//
// .delete(
//   '/:id',
//   idValidation,
//   inputValidationResultMiddleware,
//   usersController.deleteUserHandler.bind(usersController),
// );
