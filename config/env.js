import { config } from "dotenv";

config();

export const {
    PORT,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    DB_URI,
    NODE_ENV,
    ARCJET_KEY
} = process.env;