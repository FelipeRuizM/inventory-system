import express from 'express';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from './routes/api-router.js';
import apiLogin from './routes/api-login.js';
import apiLogout from './routes/api-logout.js';
import apiRefresh from './routes/api-refresh.js';
import credentials from './middleware/credentials.js';
import verifyJWT from './middleware/verifyJWT.js';
import corsOptions from './config/corsOptions.js';

const app = express();

// Express middleware
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

// Routing
app.get('/', (req, res) => {
  res.send('Node.js Server is live!');
});

app.use('/api/login', apiLogin);
app.use('/api/logout', apiLogout);
app.use('/api/refresh', apiRefresh);

// Protect API routes
app.use(verifyJWT);
app.use('/api', apiRouter);

export default app;