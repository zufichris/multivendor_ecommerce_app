import mongoose from "mongoose";

export interface IResponseData<TData> {
  data: TData;
  status: number;
  success: boolean
  message: string;
  description?: string;
  errors?: { [key: string]: any }[];
  stack?: any;
  redirect?: {
    path: string;
  };
  type?: string;
  fieldsModified?: number;
  documentsModified?: number;
  url?: string;
  path?: string;
}

export interface IResponseDataPaginated<TData> {
  data: TData[];
  page: number;
  limit: number;
  filterCount: number;
  totalCount?: number;
  status: number;
  message: string;
  success:boolean
}
export interface IQueryFilters<TData> {
  page?: number,
  limit?: number,
  filter?: mongoose.FilterQuery<TData>,
  projection?: mongoose.ProjectionType<TData>,
  queryOptions?: Omit<mongoose.QueryOptions<TData>, "limit">,
}

export interface IQueryResult<TData = unknown> {
  totalCount: number,
  filterCount: number,
  page: number,
  limit: number,
  data: TData[]
}

export type ID = string | number;
