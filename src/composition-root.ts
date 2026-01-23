import { Container } from 'inversify';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQwRepository } from './users/repositories/users.query.repository';
import { UserService } from './users/application/user.service';
// import {AuthService} from "./auth/application/auth.service";
import { UsersController } from './users/routers/controllers/user.controller/usersController';
// import {AuthController} from "./auth/routers/controllers/auth.controller";
import { TasksController } from './tasks/routers/controllers/task.controller/tasksController';
import { TasksService } from './tasks/application/tasks.service';
import { TasksRepository } from './tasks/repositories/tasks.repository';
import { TasksQueryRepository } from './tasks/repositories/tasks.query.repository';

export const container = new Container();

container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQwRepository).to(UsersQwRepository);
container.bind(TasksRepository).to(TasksRepository);
container.bind(TasksQueryRepository).to(TasksQueryRepository);

container.bind(UserService).to(UserService);
container.bind(TasksService).to(TasksService);

container.bind(UsersController).to(UsersController);
container.bind(TasksController).to(TasksController);


// container.bind(AuthService).to(AuthService);

// container.bind(AuthController).to(AuthController);

