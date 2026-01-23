import { Task } from '../../application/dtos/task.attributes';
import { WithId } from 'mongodb';
import { TaskUpdateOutputType } from '../output/task.update.output';
import { TasksUpdateDataOutput } from '../output/tasks-update.data.output';


export function mapToTasksUpdateOutputUtil(task: WithId<Task>, tg_id: string): TasksUpdateDataOutput {
  const data: TaskUpdateOutputType = {
    id: task._id.toString(),
    customer_id: tg_id,
    amount: task.amount,
    stat: task.stat,
    task_id: task.user_stat,
    dt_create: task.dt_create,

  };

  return {
    data: data,
    resp: 'ok',
  };
}
