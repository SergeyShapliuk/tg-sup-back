import { WithId } from 'mongodb';
import { User } from '../../domain/user.model';
import { UserDataOutput } from '../output/user-data.output';
import { UserOutput } from '../output/user.output';
import { UserTimerDataOutput } from '../output/user-timer-data.output';
import { UserTimerOutput } from '../output/user.timer.output';


export function mapToUserOutputUtil(user: WithId<User> | null): UserTimerDataOutput {
  const nowSec = Math.floor(Date.now() / 1000);

  const go = Math.max(0, nowSec - (user?.time_start || 0));
  const last = Math.max(0, (user?.time_end || 0) - nowSec);

  const userTimerOutput: UserTimerOutput = {
      amount: user?.amount ?? 0,
      customer_id: Number(user?.tg_id) ?? 0,
      dt_create: user?.created_at ?? '',
      id: Number(user?.tg_id) ?? 0,
      stat: Number(user?.updated_at) ?? 0,
      time_end: user?.time_end ?? 0,
      time_start: user?.time_start ?? 0,
    }
  ;
  return {
    resp: 'ok',
    second: { go, last },
    info: userTimerOutput,
  };
}
