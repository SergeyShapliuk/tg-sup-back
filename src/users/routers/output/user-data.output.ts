import { UserOutput } from './user.output';

export type UserDataOutput = {
  resp: string;
  message: string;
  user: UserOutput | null;
};
