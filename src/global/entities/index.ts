import { StatusCodes } from "../enums";

export interface IResponseData<TData> {
  data: TData;
  status: StatusCodes;
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

export interface IResponseDataPaginated<TData>{
  data: TData[];
  page: number;
  limit: number;
  filterCount: number;
  totalCount?: number;
  status: StatusCodes;
  message: string;
}

export type ID = string | number;
