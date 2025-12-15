import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_LIMIT,
    MAX_PAGE,
} from '../constants';

@Injectable()
export class PaginationPipe implements PipeTransform {
    constructor() { }

    transform(
        value: unknown,
    ): { page: number; limit: number } & Record<string, unknown> {
        const query: Record<string, unknown> =
            typeof value === 'object' && value !== null
                ? (value as Record<string, unknown>)
                : {};

        const pageRaw = query.page;
        const limitRaw = query.limit;

        const pageParsed = Number.parseInt(
            typeof pageRaw === 'string' || typeof pageRaw === 'number'
                ? String(pageRaw)
                : '',
            10,
        );
        const limitParsed = Number.parseInt(
            typeof limitRaw === 'string' || typeof limitRaw === 'number'
                ? String(limitRaw)
                : '',
            10,
        );

        const page = Number.isNaN(pageParsed) ? DEFAULT_PAGE : pageParsed;
        const limit = Number.isNaN(limitParsed) ? DEFAULT_PAGE_SIZE : limitParsed;

        if (page < 1 || page > MAX_PAGE) {
            throw new BadRequestException(
                `Page number must be between 1 and ${MAX_PAGE}.`,
            );
        }

        if (limit < 1 || limit > MAX_LIMIT) {
            throw new BadRequestException(
                `Limit must be between 1 and ${MAX_LIMIT}.`,
            );
        }
        return {
            ...query,
            page,
            limit,
        } as { page: number; limit: number } & Record<string, unknown>;
    }
}
