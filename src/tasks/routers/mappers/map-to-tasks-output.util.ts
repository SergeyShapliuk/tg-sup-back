import { TasksDataOutput } from '../output/tasks-data.output';

import { Task } from '../../application/dtos/task.attributes';
import { WithId } from 'mongodb';
import { TaskOutputType } from '../output/task.output';


export function mapToTasksOutputUtil(tasks: WithId<Task>[]): TasksDataOutput {
  const data: TaskOutputType[] = tasks.map(task => ({
    id: task._id.toString(),
    title: task.title,
    amount: task.amount,
    link: task.icon,
    icon: task.icon,
    img: task.img,
    stat: task.stat,
    user_stat: task.user_stat,
    dt_create: task.dt_create,

  }));

  return {
    data: data,
    resp: 'ok',
  };
}
