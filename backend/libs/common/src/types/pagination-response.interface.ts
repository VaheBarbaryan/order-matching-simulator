export interface PaginatedResponse<T> {
    docs: T[];
    pagination: {
        totalDocs: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        nextPage: number | null;
        prevPage: number | null;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
}
