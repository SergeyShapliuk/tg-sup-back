import { UserTimerOutput } from './user.timer.output';

export type UserTimerDataOutput = {
  resp: string;
  second: { go: number, last: number }
  info: UserTimerOutput;
};
