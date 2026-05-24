import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import profileRouter from './routes/profile.routes.js';
import cors from "cors"

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://authentication-system-beryl.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options(/.*/, cors());


app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", profileRouter);


export default app;