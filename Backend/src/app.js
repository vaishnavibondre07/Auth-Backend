import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import profileRouter from './routes/profile.routes.js';
import cors from "cors"

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:8080", "http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", profileRouter);


export default app;