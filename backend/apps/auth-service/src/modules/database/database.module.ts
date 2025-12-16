import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from './database-connection';

import * as usersSchema from '../users/users.schema'

@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.getOrThrow<string>('DATABASE_URL')
                });

                return drizzle(pool, {
                    schema: {
                        ...usersSchema
                    }
                });
            },
            inject: [ConfigService]
        }
    ],
    exports: [DATABASE_CONNECTION]
})
export class DatabaseModule { }
