"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPagination = void 0;
const buildPagination = (page, pageSize, totalItems) => {
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
exports.buildPagination = buildPagination;
