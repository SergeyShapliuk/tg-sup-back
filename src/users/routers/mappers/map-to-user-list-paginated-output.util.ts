import { WithId } from 'mongodb';
import { User } from '../../domain/user.model';
import { UserListPaginatedOutput } from '../output/user-list-paginated.output';

export function mapToUserListPaginatedOutput(
  // users: WithId<User>[],
  users: WithId<any>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): UserListPaginatedOutput {
  return {
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: users.map((user) => ({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    })),
  };
}
