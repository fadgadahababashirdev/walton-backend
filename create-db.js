import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const createDatabase = async () => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres' // Connect to default postgres database
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Check if database exists
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (result.rows.length === 0) {
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
        } else {
            console.log(`ℹ️  Database '${process.env.DB_NAME}' already exists`);
        }
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
};

createDatabase();
