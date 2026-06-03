import dotenv from "dotenv"

dotenv.config()
if(!process.env.PORT){
    throw new Error("Port is not defined")
}
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env file");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in .env file");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in .env file");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in .env file");
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in .env file");
}

if (!process.env.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is not defined in .env file");
}

if (!process.env.SITE_KEY) {
    throw new Error("SITE_KEY is not defined in .env file");
}

if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in .env file");
}


if(!process.env.BREVO_API_KEY){
    throw new Error("BREVO_API_KEY is not defined")
}

if(!process.env.CLOUD_NAME){
    throw new Error("CLOUD_NAME is not defined")
}

if(!process.env.CLOUD_API_KEY){
    throw new Error("CLOUD_API_KEY is not defined")
}

if(!process.env.CLOUD_API_SECRET){
    throw new Error("CLOUD_API_SECRET is not defined")
}

const config = {
    PORT:process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER,
    SITE_KEY: process.env.SITE_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET
}

export default config;
