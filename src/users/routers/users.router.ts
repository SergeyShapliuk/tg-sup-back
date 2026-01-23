import { Router } from 'express';
import {
  idValidation,
  tgIdValidation,
  tgIdValidationBody,
} from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { UserSortField } from './input/user-sort-field';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { userCreateInputValidation } from './user.input-dto.validation-middlewares';
import { container } from '../../composition-root';
import { UsersController } from './controllers/user.controller/usersController';
import { body } from 'express-validator';

export const usersRouter = Router({});

const usersController = container.get<UsersController>(UsersController);

// timersRouter.use(superAdminGuardMiddleware);

usersRouter

  .get(
    '/get-user-balance/:telegram_id',
    tgIdValidation,
    inputValidationResultMiddleware,
    usersController.getUserBalanceHandler.bind(usersController),
  )

  .get(
    '/get-user-timer/:telegram_id',
    tgIdValidation,
    inputValidationResultMiddleware,
    usersController.getUserTimerHandler.bind(usersController),
  )

  .get(
    '/:telegram_id',
    tgIdValidation,
    inputValidationResultMiddleware,
    usersController.getUserHandler.bind(usersController),
  )

  .post(
    '/start-user-timer',
    tgIdValidationBody,
    inputValidationResultMiddleware,
    usersController.startTimerHandler.bind(usersController),
  )

  .post(
    '/close-user-timer',
    tgIdValidationBody,
    inputValidationResultMiddleware,
    usersController.stopTimerHandler.bind(usersController),
  )

  // .post(
  //   '/registration',
  //   // userCreateInputValidation,
  //   body().isObject().withMessage('Is not data'),
  //   inputValidationResultMiddleware,
  //   usersController.createUserHandler.bind(usersController),
  // )

  // .delete(
  //   '/:id',
  //   idValidation,
  //   inputValidationResultMiddleware,
  //   usersController.deleteUserHandler.bind(usersController),
  // );
