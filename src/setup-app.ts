import express, { Express } from 'express';
import { HttpStatus } from './core/types/http-ststuses';
import { setupSwagger } from './core/swagger/setup-swagger';
import {
   TASKS_PATH,
  TESTING_PATH, USERS_PATH,

} from './core/paths/paths';

import { testingRouter } from './testing/routers/testing.router';
import { usersRouter } from './users/routers/users.router';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { tasksRouter } from './tasks/routers/tasks.router';


export const setupApp = (app: Express) => {
  // app.use(cookieParser());
  app.set('trust proxy', true);

  app.use(cors());
  app.use(express.json()); // middleware для парсинга JSON в теле запроса


  app.use(USERS_PATH, usersRouter); // Подключаем роутеры
  app.use(TASKS_PATH, tasksRouter); // Подключаем роутеры
  // app.use(AUTH_PATH, authRouter); // Подключаем роутеры
  // app.use(SECURITY_PATH, securityRouter); // Подключаем роутеры
  app.use(TESTING_PATH, testingRouter); // Подключаем тестовый роутер

  app.get('/', (req, res) => {
    res.status(HttpStatus.Ok).send('Support Active');
  });

  setupSwagger(app);

  return app;
};
