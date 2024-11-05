import * as path from 'path';
import * as dotenv from 'dotenv';

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

export default{
    port: process.env.PORT,
    database: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        dbName: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
        pass: process.env.DATABASE_PASSWORD,
    },
    jwtSecret: process.env.JWT_SECRET,
}