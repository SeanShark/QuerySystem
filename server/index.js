import path from 'path';
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import loggerRoutes from './routes/loggerRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
connectDB();

/*
The origin filed need to match with: 'quasar/src/boot/axios.js': 
axios.defaults.baseURL = 'http://yourDomainName:3000/api';
The 'origin' field: 
::IP address is OK.
::The port is required.
*/
const corsOptions = {
  exposedHeaders: "Captcha",
  credentials: true,
  origin: 'http://localhost:9000',
  // origin: 'http://119.144.159.220:3000',
};

//Middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/logger', loggerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/customer', customerRoutes);

if (process.env.NODE_ENV === 'prodution') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'server/public')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'server', 'public','index.html')));
} else {
  app.get('/', (req, res) => res.send('Server is ready'));
}
  
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => console.log(`Server started on port ${port}...`));
 