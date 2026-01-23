import { PaginatedOutput } from '../../../core/types/paginated.output';
import {UserDataOutput} from "./user-data.output";

export type UserListPaginatedOutput = {
  // meta: PaginatedOutput;
  // data: CommentDataOutput[];
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: any[];
};
