import { PaginationMeta } from "../models/common.model";

export const buildPagination = (page: number, pageSize: number, totalItems: number): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};
