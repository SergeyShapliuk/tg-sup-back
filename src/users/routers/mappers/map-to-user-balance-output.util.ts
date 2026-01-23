import { WithId } from 'mongodb';
import { User } from '../../domain/user.model';


export function mapToUserBalanceOutputUtil(user: WithId<User> | null): { resp: string, amount: number } {

  return {
    resp: user ? 'ok' : 'err',
    amount: user?.amount ?? 0,

  };
}
