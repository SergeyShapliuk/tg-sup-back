import { inject, injectable } from 'inversify';
import { UserService } from '../../../application/user.service';
import { Request, Response } from 'express';
import { UserQueryInput } from '../../input/user-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { mapToUserListPaginatedOutput } from '../../mappers/map-to-user-list-paginated-output.util';
import { HttpStatus } from '../../../../core/types/http-ststuses';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { UserCreateInput } from '../../input/user-create.input';
import { mapToUserTimerOutputUtil } from '../../mappers/map-to-user-timer-output.util';
import { mapToUserBalanceOutputUtil } from '../../mappers/map-to-user-balance-output.util';
import { mapToUserOutputUtil } from '../../mappers/map-to-user-output.util';

@injectable()
export class UsersController {
  constructor(
    @inject(UserService) private userService: UserService,
  ) {
  }

  async getUserBalanceHandler(
    req: Request<{ telegram_id: string }>,
    res: Response,
  ) {
    try {

      const tgId = req.params.telegram_id;
      const user = await this.userService.findByTgId(tgId);
      console.log('getUserHandler tgId', tgId);
      const userOutput = mapToUserBalanceOutputUtil(user);
      res.status(HttpStatus.Ok).send(userOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async getUserTimerHandler(
    req: Request<{ telegram_id: string }>,
    res: Response,
  ) {
    try {

      const tgId = req.params.telegram_id;
      const user = await this.userService.findByTgId(tgId);
      console.log('getUserTimerHandler tgId', tgId);
      console.log('getUserTimerHandler', user);
      const userOutput = mapToUserTimerOutputUtil(user);
      res.status(HttpStatus.Ok).send(userOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async getUserHandler(
    req: Request<{ telegram_id: string }>,
    res: Response,
  ) {
    try {

      const tgId = req.params.telegram_id;
      const user = await this.userService.findByTgId(tgId);
      console.log('getUserHandler tgId', tgId);
      const userOutput = mapToUserOutputUtil(user);
      res.status(HttpStatus.Ok).send(userOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async startTimerHandler(
    req: Request<{}, {}, { telegram_id: string }>,
    res: Response,
  ) {
    try {
      const tg_id = req.body.telegram_id;
      const user = await this.userService.createTimer(tg_id);
      if (!user) {
        res.status(HttpStatus.Created).send({ resp: 'err', message: 'Timer already running' });
        return;
      }
      const timerOutput = mapToUserTimerOutputUtil(user);
      res.status(HttpStatus.Created).send(timerOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async stopTimerHandler(
    req: Request<{}, {}, { telegram_id: string }>,
    res: Response,
  ) {
    try {
      const tg_id = req.body.telegram_id;
      const user = await this.userService.stopTimer(tg_id);
      if (!user) {
        res.status(HttpStatus.Created).send({ resp: 'err', message: 'Timer already running' });
        return;
      }
      res.status(HttpStatus.Created).send({
        resp: 'ok', info: {
          amount: user.amount,
          customer_id: user.tg_id,
          dt_create: user.created_at,
          id: user._id.toString(),
        },
      });
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  // async createUserHandler(
  //   req: Request<{}, {}, UserCreateInput>,
  //   res: Response,
  // ) {
  //   try {
  //     const createdUserId = await this.userService.create(req.body);
  //
  //     const createdUser = await this.userService.findByIdOrFail(createdUserId);
  //
  //     const userOutput = mapToUserOutputUtil(createdUser);
  //     res.status(HttpStatus.Created).send(userOutput);
  //   } catch (e) {
  //     errorsHandler(e, res);
  //   }
  // }

  // async deleteUserHandler(
  //   req: Request<{ id: string }>,
  //   res: Response,
  // ) {
  //   try {
  //     const id = req.params.id;
  //
  //     await this.userService.delete(id);
  //     // Отправка статуса 204 (No Content) без тела ответа
  //     res.status(HttpStatus.NoContent).send('No Content');
  //   } catch (e) {
  //     errorsHandler(e, res);
  //   }
  // }

}
